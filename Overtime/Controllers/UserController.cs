using JWT;
using JWT.Algorithms;
using JWT.Serializers;
using Microsoft.AspNetCore.Mvc;
using Overtime.Models;
using System;
using System.Collections.Generic;

namespace Overtime.Controllers
{
    public class UserController : Controller
    {
        private static DataAccess dataAccess;
        private static string secret;
        static UserController()
        {
            dataAccess = new DataAccess();
            secret = "xxOvertimexx";
        }
        [Route("user/whois")]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult Whois()
        {
            if (checkAuth())
            {
                String token;
                Request.Cookies.TryGetValue("MTOK", out token);
                return Json(decodeJWT(token));
            }
            return Content("ko");
        }
        [Route("user/checkauth")]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult CheckAuth()
        {
            if (checkAuth())
            {
                String token;
                Request.Cookies.TryGetValue("MTOK", out token);
                return Json(decodeJWT(token));
            }
            return Content("ko");
        }
        [Route("user/signin")]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult SignIn([FromBody]UserModel user)
        {
            if (checkAuth())
            {
                Response.StatusCode = 200;
                return Content("User already authenticated");
            }
            UserModel userFound = dataAccess.FindUser(user.Email);
            if (userFound != null && BCrypt.Net.BCrypt.Verify(user.Password, userFound.Password))
            {
                var payload = new Dictionary<string, object>();
                payload.Add("email", userFound.Email);
                IJwtAlgorithm algorithm = new HMACSHA256Algorithm();
                IJsonSerializer serializer = new JsonNetSerializer();
                IBase64UrlEncoder urlEncoder = new JwtBase64UrlEncoder();
                IJwtEncoder encoder = new JwtEncoder(algorithm, serializer, urlEncoder);
                var token = encoder.Encode(payload, secret);
                Response.Cookies.Append("MTOK", token);
                Response.StatusCode = 200;
                return Content("User authenticated");
            }
            Response.StatusCode = 400;
            return Content("Invalid email/password");
        }
        [Route("user/signup")]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult SignUp([FromBody]UserModel user)
        {

            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            dataAccess.InsertUser(user);
            Response.StatusCode = 200;
            return Json(user);
        }
        [Route("user/signout")]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult SignOut()
        {

            Response.Cookies.Delete("MTOK");
            Response.StatusCode = 200;
            return Content("ok");
        }
        private string decodeJWT(string token)
        {
            IJsonSerializer serializer = new JsonNetSerializer();
            IDateTimeProvider provider = new UtcDateTimeProvider();
            IJwtValidator validator = new JwtValidator(serializer, provider);
            IBase64UrlEncoder urlEncoder = new JwtBase64UrlEncoder();
            IJwtDecoder decoder = new JwtDecoder(serializer, validator, urlEncoder);
            var json = decoder.Decode(token, secret, verify: true);
            Console.WriteLine(json);
            return json;
        }
        private bool checkAuth()
        {
            if (Request.Cookies.ContainsKey("MTOK"))
            {
                string token;
                Request.Cookies.TryGetValue("MTOK", out token);
                if (token == null)
                {
                    Console.WriteLine("Cookie not set");
                    return false;
                }
                try
                {
                    var json = decodeJWT(token);
                    return true;
                }
                catch (TokenExpiredException)
                {
                    Console.WriteLine("Token has expired");
                    return false;
                }
                catch (SignatureVerificationException)
                {
                    Console.WriteLine("Token has invalid signature");
                    return false;
                }
            }
            Console.WriteLine("Cookie not set");
            return false;
        }
        public IActionResult Index()
        {
            return View();
        }
    }
}
