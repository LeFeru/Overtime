using JWT;
using JWT.Serializers;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Overtime.Models;
using System;
using System.Collections.Generic;

namespace Overtime.Controllers
{
    public class ProjectController : Controller
    {
        private static string secret;
        private static readonly IList<ProjectModel> _projects;
        private static DataAccess dataAccess;
        static ProjectController()
        {
            secret = "xxOvertimexx";
            dataAccess = new DataAccess();
            /*_projects = new List<ProjectModel>
            {
                new ProjectModel
                {
                    Author = "Rachid",
                    Title = "Overtime",
                    Deadline = "17/10/2018",
                    Priority = 4,
                    NumberOfTasks = 20,
                    NumberOfTasksCompleted= 10
                },
                new ProjectModel
                {
                    Author = "Rachid",
                    Title = "SportStore",
                    Deadline = "17/10/2018",
                    Priority = 4,
                    NumberOfTasks = 20,
                    NumberOfTasksCompleted= 10
                },
                new ProjectModel
                {
                    Author = "Rachid",
                    Title = "Pollser",
                    Deadline = "17/10/2018",
                    Priority = 4,
                    NumberOfTasks = 20,
                    NumberOfTasksCompleted= 10
                },
            };*/
        }
        /*[Route("projects/getproject")]
        [HttpGet]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult getProject(String title)
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
            return Json(dataAccess.FindProject(user.Email, title));
        }*/
        [Route("projects")]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult Projects()
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
            return Json(dataAccess.FindProjects(user.Email));
        }

        [Route("projects/new")]
        [HttpPost]
        public ActionResult AddProject(ProjectModel newProject)
        {
            if (!checkAuth())
            {
                Response.StatusCode = 400;
                return new EmptyResult();
            }
            newProject.NumberOfTasks = 0;
            newProject.NumberOfTasksCompleted = 0;
            dataAccess.insertProject(newProject);
            Response.StatusCode = 200;
            return Content("newProject");
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
        [Route("projects/remove")]
        [HttpPost]
        public ActionResult RemoveTask(ProjectModel oldProject)
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
            if (!user.Email.Equals(oldProject.Owner))
            {
                Response.StatusCode = 400;
                return new EmptyResult();
            }
            dataAccess.removeProject(oldProject);
            Response.StatusCode = 200;
            return Content("oldProject");
        }
        public IActionResult Index()
        {
            Response.StatusCode = 200;
            return View();
        }
    }
}
