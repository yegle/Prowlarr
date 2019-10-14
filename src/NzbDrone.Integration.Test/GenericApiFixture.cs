﻿using System.Net;
using FluentAssertions;
using NUnit.Framework;
using NzbDrone.Common.Extensions;
using NzbDrone.Integration.Test.Client;
using RestSharp;

namespace NzbDrone.Integration.Test
{
    [TestFixture]
    public class GenericApiFixture : IntegrationTest
    {
        [TestCase("application/json")]
        [TestCase("text/html, application/json")]
        [TestCase("application/xml, application/json")]
        [TestCase("text/html, */*")]
        [TestCase("*/*")]
        [TestCase("")]
        public void should_get_json_with_accept_header(string header)
        {

            var request = new RestRequest("system/status")
            {
                RequestFormat = DataFormat.None
            };
            request.AddHeader("Accept", header);

            var response = RestClient.Execute(request);

            response.StatusCode.Should().Be(HttpStatusCode.OK);
            response.ContentType.Should().Be("application/json; charset=utf-8");
        }

        [TestCase("application/xml")]
        [TestCase("text/html")]
        [TestCase("application/junk")]
        public void should_get_unacceptable_with_accept_header(string header)
        {
            IgnoreOnMonoVersions("5.12", "5.14");

            var request = new RestRequest("system/status")
            {
                RequestFormat = DataFormat.None
            };
            request.AddHeader("Accept", header);

            var response = RestClient.Execute(request);

            response.StatusCode.Should().Be(HttpStatusCode.NotAcceptable);
        }
    }
}
