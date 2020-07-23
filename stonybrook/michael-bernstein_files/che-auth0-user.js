const refreshTokenTerm = 'refreshToken';
let checkQueryParam = function (sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
};

var checkPageIntegrity = function() {
  const logMessage = function(message) {
    if (checkQueryParam('debugCPI')) {
      console.log('Page Integrity DEBUG: ',message);
    }
  }
  const CPIdisplayModal = function(title, body, closable, retryCount) {
    retryCount = (typeof retryCount !== 'undefined') ?  retryCount : 0;
    try {
      if (window.MODALS && window.MODALS.displayModal) {
          window.MODALS.displayModal({
            closable: (closable) ? true : false,
            title,
            body,
          });
      } else {
        retryCount++;
        if (retryCount <= 20) {
          logMessage('displayModal function not available - retry attempt: '+retryCount);
          setTimeout(function(){CPIdisplayModal(title,body,closable,retryCount)},1000);
        } else {
          logMessage('displayModel function not available aborting retry - limit reached: '+retryCount);
        }
      }
    } catch (e) {
        logMessage('Caught Exception when trying to display modal: '+e.message);
    }
  }
  const CPIdisplaySLAccessExpired = function() {
    CPIEventDispatch('CPIExpiredMsgShown');
    logMessage('Showing Access Expired Message');
    CPIdisplayModal('Your chronicle.com access has expired.', 'Please visit <a href="https://www.chronicle.com">chronicle.com</a> or contact your administrator for further details regarding renewal of institutional access.', false);
  }

  const CPIdisplayImportantMessage = function() {
    CPIEventDispatch('CPIWhitelistMsgShown');
    logMessage('Showing Whitelist Message');
    CPIdisplayModal('Ad Blocker Detected', 'Please support our site by whitelisting chronicle.com. We depend on advertising in order to provide you with essential independent journalism.', true);
  }

  const checkForValidSub = function() {
    let validSub = false;
    try {
      if (digitalData) {
        if (digitalData.user && digitalData.user[0] && digitalData.user[0].entitlements && digitalData.user[0].entitlements.length > 0) {
          let entitlementArray = digitalData.user[0].entitlements;
          for(var i = 0; i < entitlementArray.length; i++) {
            if (entitlementArray[i].siteLicense) {
              let sitelicenseArray = entitlementArray[i].siteLicense;
              for(var y = 0; y < sitelicenseArray.length; y++) {
                if (sitelicenseArray[y].status && sitelicenseArray[y].status.toLowerCase() == 'active') {
                  logMessage('SL: '+JSON.stringify(sitelicenseArray[y]));
                  validSub = true;
                }
              }
            } else if (entitlementArray[i].subscription && entitlementArray[i].subscription.active) {
              let subscriptionArray = entitlementArray[i].subscription.active;
              for(var y = 0; y < subscriptionArray.length; y++) {
                if (subscriptionArray[y].status && subscriptionArray[y].status.toLowerCase() == 'active' && subscriptionArray[y].sku.toLowerCase() != 'free') {
                  logMessage('Sub: '+JSON.stringify(subscriptionArray[y]));
                  validSub = true;
                }
              }
            }
          }
        }
      }
    } catch (e) {
      logMessage('Sub/SL Check Exception: '+e.message);
    }
    logMessage('Sub/SL Check: '+validSub);
    return validSub;
  }

  const checkForValidContentType = function() {
    let validType = false;
    try {
      if (digitalData) {
        if (digitalData.page && digitalData.page.category && digitalData.page.category.pageType) {
          let pageType = digitalData.page.category.pageType.toLowerCase();
          const pageTypeList = ['article','blogpost','newsletterpost']
          if (pageTypeList.indexOf(pageType) > -1) {
            logMessage('Not Excluding Content Type: '+pageType);
            validType = true;
          }
        }
      }
    } catch (e) {
      logMessage('Content Type Check Exception: '+e.message);
    }
    logMessage('Content Type Check: '+validType);
    return validType;
  }

  const checkForServices = function() {
    var blueConicDetected = true;
    try {
      if (!(window.blueConicClient && window.blueConicClient.getChannelId())) {
        logMessage('BlueConic client not detected');
        blueConicDetected = false;
      }
      if (document.cookie.indexOf("BCSessionID") == -1) {
        logMessage('BlueConic cookie not detected');
        blueConicDetected = false;
      }
    } catch (e) {
      logMessage('BlueConic not detected Exception: '+e.message);
      blueConicDetected = false;
    }

    if (!blueConicDetected || checkQueryParam('debugCPIBCError')) {
      logMessage('BlueConic not detected');
      return false;
    }
    logMessage('Services check passed');
    return true;
  }

  const checkIfExempt = function () {
    if (checkQueryParam('debugCPINotExempt')){
      logMessage('Request excempt override');
      return false;
    }
    if (checkForValidSub()) {
      logMessage('Valid Sub/SL Detected');
      return true;
    }
    if (checkForValidContentType()){
      logMessage('Content Type not excempt');
      return false;
    }
/*
    const allowedPaths = [
      "/article"
    ];
    const pathRegEx = new RegExp(allowedPaths.join("|"), "i");

    if (pathRegEx.test(window.location.pathname)) {
      logMessage('Not excempt because of path');
      return false;
    }
*/
    logMessage('Request excempt');
    return true;
  }
  const checkBrowserSettings = function() {
    const allowedHosts = [
      "chronicle.com$",
      "psdops.com$"
    ]
    const hostRegEx = new RegExp(allowedHosts.join("|"), "i");
    if (window.location.hostname) {
      if (!hostRegEx.test(window.location.hostname) || checkQueryParam('debugCPIHostError')) {
        logMessage('Invalid host detected');
        return false;
      }
    }
    logMessage('Browser Settings passed');
    return true;
  }
  const maskContent = function() {
    $('main').empty();
  }
  const CPIEventDispatch = function (eventName) {
    if (eventName) {
      try {
        logMessage('Dispatching Event: '+eventName);
        let eventObj = new Event(eventName);
        document.dispatchEvent(eventObj);
      } catch (e) {
        logMessage('CPI Event Exception: '+e.message);
      }
    }
  }

  if (!checkIfExempt()) {
    if (!checkBrowserSettings()) {
      CPIdisplaySLAccessExpired();
      maskContent();
    } else if (!checkForServices()) {
      CPIdisplayImportantMessage();
      //maskContent();
    }
  } else {
    logMessage('Request has been exempted');
  }
}

var processRefershToken = function() {

  if (checkQueryParam(refreshTokenTerm)) {
    $("body").hide();
    $(document).ready(function() {
      $.ajax({
      url: "https://cdn.auth0.com/js/auth0/9.13.1/auth0.min.js",
      dataType: "script",
      async: false,
      success: () => {
        const updateUrlParameter = (uri, key, value) => {
          var i = uri.indexOf('#');
          var hash = i === -1 ? '' : uri.substr(i);
          uri = i === -1 ? uri : uri.substr(0, i);
          var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
          var separator = uri.indexOf('?') !== -1 ? "&" : "?";
          if (uri.match(re)) {
            uri = uri.replace(re, '$1' + key + "=" + value + '$2');
          } else {
            uri = uri + separator + key + "=" + value;
          }
          return uri + hash;
        };
        const removeURLParameter = (url, parameter) => {
            //prefer to use l.search if you have a location/link object
            var urlparts = url.split('?');
            if (urlparts.length >= 2) {

                var prefix = encodeURIComponent(parameter) + '=';
                var pars = urlparts[1].split(/[&;]/g);

                //reverse iteration as may be destructive
                for (var i = pars.length; i-- > 0;) {
                    //idiom for string.startsWith
                    if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                        pars.splice(i, 1);
                    }
                }

                return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
            }
            return url;
        };

        const updateUrlParameters = (uri, params) => {
          let url = uri;
          if (typeof params === 'object' && params !== null) {
            Object.entries(params).forEach(([key, value]) => {
              url = updateUrlParameter(url, key, value);
            });
          }
          return url;
        };
        const config = {
          "clientConfigurationBaseUrl": "https://cdn.auth0.com/",
          "cdn": "https://sdk.auth0.com/",
          "authParams": {
            "response_type": "code",
            "scope": "openid profile email offline_access",
            "audience": "https://chronicle-user-api.chronicle.com/",
            "state": removeURLParameter(removeURLParameter(updateUrlParameters(window.location.href, {
              bc_nonce: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
            }),refreshTokenTerm),'message')
          }
        };
        const presetEnvcfg = {
          dev: {
            auth0Domain: "login.dev.chronicle.com",
            clientId: "fuHEbsXkAQnhC5y8IKoNL683bTGFus66",
            auth0Tenant: "chronicle-dev",
            callbackURL: window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/oauth/token',
            authorizationServer: {
              "url": "https://login.dev.chronicle.com",
              "issuer": "https://login.dev.chronicle.com/"
            }
          },
          qa: {
            auth0Domain: "login.qa.chronicle.com",
            clientId: "tUSfdfdwPlleAo9UMfPEV1OZiXDdkRjQ",
            auth0Tenant: "chronicle-qa",
            callbackURL: window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/oauth/token',
            authorizationServer: {
              "url": "https://login.qa.chronicle.com",
              "issuer": "https://login.qa.chronicle.com/"
            }
          },
          stage: {
            auth0Domain: "login.stage.chronicle.com",
            clientId: "STAyYgYWm7Z0sNclFCfQu0Q1n8OP7SH5",
            auth0Tenant: "chronicle-stage",
            callbackURL: window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/oauth/token',
            authorizationServer: {
              "url": "https://login.stage.chronicle.com",
              "issuer": "https://login.stage.chronicle.com/"
            }
          },
          prod: {
            auth0Domain: "login.chronicle.com",
            clientId: "RvNGYRioLrX5IZAuJFX8dGlFmz9sd49U",
            auth0Tenant: "chronicle-prod",
            callbackURL: window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/oauth/token',
            authorizationServer: {
              "url": "https://login.chronicle.com",
              "issuer": "https://login.chronicle.com/"
            }
          }
        };
        const getEnvCfg = function() {
          let returnValue = 'unknown';
          const fallbackEnv = presetEnvcfg['prod'];

          console.log('Using: ', window.location.hostname);
          switch (window.location.hostname) {
            case "che.qa2.chronicle.psdops.com":
            case "che.qa.chronicle.psdops.com":
            case "chronicle.blueconic.net":
            case "che.dev.brightspot.local":
            case "qa2.psdops.chronicle.com":
            returnValue = 'qa';
            break;
            case "che.uat.chronicle.psdops.com":
            returnValue = 'stage';
            break;
            case "www.chronicle.com":
            case "chronicle.com":
            case "prod.chronicle.psdops.com":
            returnValue = 'prod';
            break;
          }
          if (typeof presetEnvcfg !== 'undefined' && presetEnvcfg[returnValue]) return presetEnvcfg[returnValue];
          // Fall back to production
          console.log('Host not whitelisted, using fallback logic');
          fallbackEnv.callbackURL = 'https://www.chronicle.com/oauth/token';
          return fallbackEnv;
        };
        envConfig = getEnvCfg();
        console.log(envConfig);
        config["authorizationServer"] = envConfig["authorizationServer"];
        if (envConfig.auth0Domain) {
          var language;
          var connection = config.connection;
          var webAuth = new auth0.WebAuth({
            clientID: envConfig.clientId,
            domain: envConfig.auth0Domain,
            redirectUri: envConfig.callbackURL,
            responseType: 'token id_token'
          });
          var authorizeUrl = webAuth.client.buildAuthorizeUrl(
            {
              clientID: envConfig.clientId,
              domain: envConfig.auth0Domain,
              redirectUri: envConfig.callbackURL,
              responseType: config.authParams.response_type,
              state: config.authParams.state,
              scope: config.authParams.scope,
              audience: config.authParams.audience
            }
          );
          if (authorizeUrl) {
            const extraUrlParams = {};
            if (checkQueryParam("message")) {
              if (checkQueryParam("success") != "false") {
                extraUrlParams.chronicle_message = checkQueryParam("message");
              } else {
                extraUrlParams.chronicle_error_message = checkQueryParam("message");
              }
            }
            if (checkQueryParam("email")) {
              extraUrlParams.login_hint = checkQueryParam("email");
              if (checkQueryParam("newEmail")) {
                extraUrlParams.login_hint = checkQueryParam("newEmail");
              }
            }
            window.location.href = updateUrlParameters(authorizeUrl, extraUrlParams);
          } else {
            $("body").show();
          }
/* Not needed -- just going to redirect user anyway. Can be used for future use case.
          webAuth.checkSession({
            scope: config.authParams.scope,
            audience: config.authParams.audience
          }, function (err, authResult) {
            console.log('Error', err);
            console.log('AuthResult',authResult);
            console.log('AuthorizationUrl',authorizeUrl);
          });
*/
        }
      }
    });
  });
  }
}

if (!window.jQuery) {
  (function() {
    // Load the script
    var script = document.createElement("SCRIPT");
    script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
    script.type = 'text/javascript';
    script.onload = function() {
      var $ = window.jQuery;
      processRefershToken();
      $(document).ready(function() {
        try {
          setTimeout(function(){checkPageIntegrity();},10000);
        } catch (e) {
          console.log('CPI Error Exception:'+e);
        }
      });
    };
    document.getElementsByTagName("head")[0].appendChild(script);
  })();
}

if (window.jQuery) {
  processRefershToken();
  $(document).ready(function() {
    try {
      setTimeout(function(){checkPageIntegrity();},10000);
    } catch (e) {
      console.log('CPI Error Exception:'+e);
    }
  });
}
