using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntelliDocs.Core
{
  public  class Result<T>
    {
        public bool IsSuccess { get; set; }
        public T Data { get; set; }
        public string ErrorMessage { get; set; }
        public int StatusCode { get; set; }

        // Success response
        public static Result<T> Success(T data)
        {
            return new Result<T>
            {
                IsSuccess = true,
                Data = data,
                StatusCode = 200 // OK
            };
        }

        // Failure response with a custom message
        public static Result<T> Failure(string errorMessage, int statusCode = 400)
        {
            return new Result<T>
            {
                IsSuccess = false,
                ErrorMessage = errorMessage,
                StatusCode = statusCode
            };
        }

        // Utility for NotFound response
        public static Result<T> NotFound(string errorMessage = "Not Found")
        {
            return new Result<T>
            {
                IsSuccess = false,
                ErrorMessage = errorMessage,
                StatusCode = 404
            };
        }

        // Utility for BadRequest response
        public static Result<T> BadRequest(string errorMessage = "Bad Request")
        {
            return new Result<T>
            {
                IsSuccess = false,
                ErrorMessage = errorMessage,
                StatusCode = 400
            };
        }
    }
}
