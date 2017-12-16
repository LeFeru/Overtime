using Microsoft.AspNetCore.Mvc;

namespace Overtime.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            Response.StatusCode = 200;
            return View();
        }


    }
}
