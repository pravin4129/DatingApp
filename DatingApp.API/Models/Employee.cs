using System;

namespace DatingApp.API.Models
{
    public class Employee
    {
        public int Id { get; set; }

        public string EmpNam { get; set; }

        public DateTime DateOfJoining { get; set; }

        public string Sex { get; set; }

        public decimal Salary { get; set; }
    }
}