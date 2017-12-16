using JWT;
using JWT.Serializers;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Overtime.Models;
using System;

namespace Overtime.Controllers
{
    public class TaskController : Controller
    {
        private static string secret;
        private static DataAccess dataAccess;
        static TaskController()
        {
            secret = "xxOvertimexx";
            dataAccess = new DataAccess();
        }
        [Route("tasks/new")]
        [HttpPost]
        public ActionResult AddTask(TaskModel newTask)
        {
            if (!checkAuth())
            {
                Response.StatusCode = 400;
                return new EmptyResult();
            }
            string token;
            Request.Cookies.TryGetValue("MTOK", out token);
            string json = decodeJWT(token);
            UserModel user = JsonConvert.DeserializeObject<UserModel>(json);
            if (!user.Email.Equals(newTask.Owner))
            {
                Response.StatusCode = 400;
                return new EmptyResult();
            }
            newTask.State = "To Do";
            dataAccess.insertTask(newTask);
            Response.StatusCode = 200;
            return Content("newTask");
        }
        [Route("tasks/remove")]
        [HttpPost]
        public ActionResult RemoveTask(TaskModel oldTask)
        {
            if (!checkAuth())
            {
                Response.StatusCode = 400;
                return new EmptyResult();
            }
            string token;
            Request.Cookies.TryGetValue("MTOK", out token);
            string json = decodeJWT(token);
            UserModel user = JsonConvert.DeserializeObject<UserModel>(json);
            if (!user.Email.Equals(oldTask.Owner))
            {
                Response.StatusCode = 400;
                return new EmptyResult();
            }
            dataAccess.removeTask(oldTask);
            Response.StatusCode = 200;
            return Content("oldTask");
        }
        [Route("tasks/done")]
        [HttpPost]
        public ActionResult UpdateTask(TaskModel doneTask)
        {
            if (!checkAuth())
            {
                Response.StatusCode = 400;
                return new EmptyResult();
            }
            string token;
            Request.Cookies.TryGetValue("MTOK", out token);
            string json = decodeJWT(token);
            UserModel user = JsonConvert.DeserializeObject<UserModel>(json);
            if (!user.Email.Equals(doneTask.Owner))
            {
                Response.StatusCode = 400;
                return new EmptyResult();
            }
            dataAccess.updateTask(doneTask);
            Response.StatusCode = 200;
            return Content("doneTask");
        }
        [Route("tasks/")]
        [HttpGet]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult getTasks(String title)
        {
            if (!checkAuth())
            {
                Response.StatusCode = 400;
                return new EmptyResult();
            }
            string token;
            Request.Cookies.TryGetValue("MTOK", out token);
            string json = decodeJWT(token);
            UserModel user = JsonConvert.DeserializeObject<UserModel>(json);
            return Json(dataAccess.FindTasks(user.Email, title));
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
