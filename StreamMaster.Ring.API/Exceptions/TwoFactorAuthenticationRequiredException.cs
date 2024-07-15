﻿namespace StreamMaster.Ring.API.Exceptions
{
    /// <summary>
    /// Exception thrown when the Ring API required two factor authentication for returning an access token
    /// </summary>
    public class TwoFactorAuthenticationRequiredException : Exception
    {
        /// <summary>
        /// The error message to return
        /// </summary>
        private const string errorMessage = "The account you're trying to log on with requires two factor authentication. Provide the code received through a text message and authenticate again.";

        public TwoFactorAuthenticationRequiredException() : base(errorMessage)
        {
        }

        public TwoFactorAuthenticationRequiredException(Exception innerException) : base(errorMessage, innerException)
        {
        }

        protected TwoFactorAuthenticationRequiredException(System.Runtime.Serialization.SerializationInfo info, System.Runtime.Serialization.StreamingContext context) : base(info, context)
        {
        }

        public TwoFactorAuthenticationRequiredException(string? message) : base(message)
        {
        }

        public TwoFactorAuthenticationRequiredException(string? message, Exception? innerException) : base(message, innerException)
        {
        }
    }
}
