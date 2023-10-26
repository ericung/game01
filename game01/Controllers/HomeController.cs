using game01.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace game01.Controllers
{
    public class HomeController : Controller
    {
        static List<string> Users;

        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            Users = new List<string>();
            _logger = logger;
        }

        public IActionResult Index()
        {
            HomeViewModel model = new HomeViewModel();
            string user = "";
            switch (Users.Count)
            {
                case 0:
                    {
                        user = "red";
                        Users.Add("red");
                        break;
                    }
                case 1:
                    {
                        user = "blue";
                        Users.Add("blue");
                        break;
                    }
                default:
                    {
                        break;
                    }
            }

            model.User = user;

            return View(model);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}