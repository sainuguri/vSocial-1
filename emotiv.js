/*!
nametags.js
 
Created by David Rowe on 10 Mar 2016.
Copyright 2016 David Rowe.
 
Information: http://ctrlaltstudio.com/hifi/nametags
 
Disclaimers:
1. The avatar identification provided by this script is not guaranteed: users can set their display name to whatever they like.
2. The content of the name tags displayed by this script is not moderated.
 
Distributed under the Creative Commons Attribution-NoDerivatives 4.0 International (CC BY-ND 4.0) license.
See https://creativecommons.org/licenses/by-nd/4.0/
*/
var PlayFab = typeof PlayFab != 'undefined' ? PlayFab : {};

if(!PlayFab.settings) {
    PlayFab.settings = {
        titleId: null, // You must set this value for PlayFabSdk to work properly (Found in the Game Manager for your title, at the PlayFab Website)
        developerSecretKey: null, // For security reasons you must never expose this value to the client or players - You must set this value for Server-APIs to work properly (Found in the Game Manager for your title, at the PlayFab Website)
        advertisingIdType: null,
        advertisingIdValue: null,

        // disableAdvertising is provided for completeness, but changing it is not suggested
        // Disabling this may prevent your advertising-related PlayFab marketplace partners from working correctly
        disableAdvertising: false,
        AD_TYPE_IDFA: "Idfa",
        AD_TYPE_ANDROID_ID: "Android_Id"
    }
}

if(!PlayFab._internalSettings) {
    PlayFab._internalSettings = {
        sessionTicket: null,
        sdkVersion: "0.31.161003",
        buildIdentifier: "jbuild_javascriptsdk_1",
        productionServerUrl: ".playfabapi.com",
        logicServerUrl: null,

        GetServerUrl: function () {
            return "https://" + PlayFab.settings.titleId + PlayFab._internalSettings.productionServerUrl;
        },

        GetLogicServerUrl: function () {
            return PlayFab._internalSettings.logicServerUrl;
        },

        ExecuteRequest: function (completeUrl, data, authkey, authValue, callback) {
            if (callback != null && typeof (callback) != "function")
                throw "Callback must be null of a function";

            if (data == null)
                data = {};

            var startTime = new Date();
            var requestBody = JSON.stringify(data);

            var xhr = new XMLHttpRequest();
            // window.console.log("URL: " + completeUrl);
            xhr.open("POST", completeUrl, true);

            xhr.setRequestHeader('Content-Type', 'application/json');

            if (authkey != null)
                xhr.setRequestHeader(authkey, authValue);

            xhr.setRequestHeader('X-PlayFabSDK', "JavaScriptSDK-" + PlayFab._internalSettings.sdkVersion);

            xhr.onloadend = function () {
                if (callback == null)
                    return;

                var result;
                try {
                    // window.console.log("parsing json result: " + xhr.responseText);
                    result = JSON.parse(xhr.responseText);
                } catch (e) {
                    result = {
                        code: 503, // Service Unavailable
                        status: "Service Unavailable",
                        error: "Connection error",
                        errorCode: 2, // PlayFabErrorCode.ConnectionError
                        errorMessage: xhr.responseText
                    };
                }

                result.CallBackTimeMS = new Date() - startTime;

                if (result.code === 200)
                    callback(result, null);
                else
                    callback(null, result);
            }

            xhr.onerror = function () {
                if (callback == null)
                    return;

                var result;
                try {
                    result = JSON.parse(xhr.responseText);
                } catch (e) {
                    result = {
                        code: 503, // Service Unavailable
                        status: "Service Unavailable",
                        error: "Connection error",
                        errorCode: 2, // PlayFabErrorCode.ConnectionError
                        errorMessage: xhr.responseText
                    };
                }

                result.CallBackTimeMS = new Date() - startTime;
                callback(null, result);
            }

            xhr.send(requestBody);
        }
    }
}

PlayFab.ClientApi = {

    IsClientLoggedIn: function () {
        return PlayFab._internalSettings.sessionTicket != null && PlayFab._internalSettings.sessionTicket.length > 0;
    },

    GetPhotonAuthenticationToken: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetPhotonAuthenticationToken", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    LoginWithAndroidDeviceID: function (request, callback) {
        request.TitleId = PlayFab.settings.titleId != null ? PlayFab.settings.titleId : request.TitleId; if (request.TitleId == null) throw "Must be have PlayFab.settings.titleId set to call this method";

        var overloadCallback = function (result, error) {
            if (result != null && result.data.SessionTicket != null) {
                PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
                PlayFab.ClientApi._MultiStepClientLogin(result.data.SettingsForUser.NeedsAttribution);
            }
            if (callback != null && typeof (callback) == "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/LoginWithAndroidDeviceID", request, null, null, overloadCallback);
    },

    LoginWithCustomID: function (request, callback) {
        request.TitleId = PlayFab.settings.titleId != null ? PlayFab.settings.titleId : request.TitleId; if (request.TitleId == null) throw "Must be have PlayFab.settings.titleId set to call this method";

        var overloadCallback = function (result, error) {
            if (result != null && result.data.SessionTicket != null) {
                PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
                PlayFab.ClientApi._MultiStepClientLogin(result.data.SettingsForUser.NeedsAttribution);
            }
            if (callback != null && typeof (callback) == "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/LoginWithCustomID", request, null, null, overloadCallback);
    },

    LoginWithEmailAddress: function (request, callback) {
        request.TitleId = PlayFab.settings.titleId != null ? PlayFab.settings.titleId : request.TitleId; if (request.TitleId == null) throw "Must be have PlayFab.settings.titleId set to call this method";

        var overloadCallback = function (result, error) {
            if (result != null && result.data.SessionTicket != null) {
                PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
                PlayFab.ClientApi._MultiStepClientLogin(result.data.SettingsForUser.NeedsAttribution);
            }
            if (callback != null && typeof (callback) == "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/LoginWithEmailAddress", request, null, null, overloadCallback);
    },

    LoginWithFacebook: function (request, callback) {
        request.TitleId = PlayFab.settings.titleId != null ? PlayFab.settings.titleId : request.TitleId; if (request.TitleId == null) throw "Must be have PlayFab.settings.titleId set to call this method";

        var overloadCallback = function (result, error) {
            if (result != null && result.data.SessionTicket != null) {
                PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
                PlayFab.ClientApi._MultiStepClientLogin(result.data.SettingsForUser.NeedsAttribution);
            }
            if (callback != null && typeof (callback) == "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/LoginWithFacebook", request, null, null, overloadCallback);
    },

    LoginWithGameCenter: function (request, callback) {
        request.TitleId = PlayFab.settings.titleId != null ? PlayFab.settings.titleId : request.TitleId; if (request.TitleId == null) throw "Must be have PlayFab.settings.titleId set to call this method";

        var overloadCallback = function (result, error) {
            if (result != null && result.data.SessionTicket != null) {
                PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
                PlayFab.ClientApi._MultiStepClientLogin(result.data.SettingsForUser.NeedsAttribution);
            }
            if (callback != null && typeof (callback) == "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/LoginWithGameCenter", request, null, null, overloadCallback);
    },

    LoginWithGoogleAccount: function (request, callback) {
        request.TitleId = PlayFab.settings.titleId != null ? PlayFab.settings.titleId : request.TitleId; if (request.TitleId == null) throw "Must be have PlayFab.settings.titleId set to call this method";

        var overloadCallback = function (result, error) {
            if (result != null && result.data.SessionTicket != null) {
                PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
                PlayFab.ClientApi._MultiStepClientLogin(result.data.SettingsForUser.NeedsAttribution);
            }
            if (callback != null && typeof (callback) == "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/LoginWithGoogleAccount", request, null, null, overloadCallback);
    },

    LoginWithIOSDeviceID: function (request, callback) {
        request.TitleId = PlayFab.settings.titleId != null ? PlayFab.settings.titleId : request.TitleId; if (request.TitleId == null) throw "Must be have PlayFab.settings.titleId set to call this method";

        var overloadCallback = function (result, error) {
            if (result != null && result.data.SessionTicket != null) {
                PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
                PlayFab.ClientApi._MultiStepClientLogin(result.data.SettingsForUser.NeedsAttribution);
            }
            if (callback != null && typeof (callback) == "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/LoginWithIOSDeviceID", request, null, null, overloadCallback);
    },

    LoginWithKongregate: function (request, callback) {
        request.TitleId = PlayFab.settings.titleId != null ? PlayFab.settings.titleId : request.TitleId; if (request.TitleId == null) throw "Must be have PlayFab.settings.titleId set to call this method";

        var overloadCallback = function (result, error) {
            if (result != null && result.data.SessionTicket != null) {
                PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
                PlayFab.ClientApi._MultiStepClientLogin(result.data.SettingsForUser.NeedsAttribution);
            }
            if (callback != null && typeof (callback) == "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/LoginWithKongregate", request, null, null, overloadCallback);
    },

    LoginWithPlayFab: function (request, callback) {
        request.TitleId = PlayFab.settings.titleId != null ? PlayFab.settings.titleId : request.TitleId; if (request.TitleId == null) throw "Must be have PlayFab.settings.titleId set to call this method";

        var overloadCallback = function (result, error) {
            if (result != null && result.data.SessionTicket != null) {
                PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
                PlayFab.ClientApi._MultiStepClientLogin(result.data.SettingsForUser.NeedsAttribution);
            }
            if (callback != null && typeof (callback) == "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/LoginWithPlayFab", request, null, null, overloadCallback);
    },

    LoginWithSteam: function (request, callback) {
        request.TitleId = PlayFab.settings.titleId != null ? PlayFab.settings.titleId : request.TitleId; if (request.TitleId == null) throw "Must be have PlayFab.settings.titleId set to call this method";

        var overloadCallback = function (result, error) {
            if (result != null && result.data.SessionTicket != null) {
                PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
                PlayFab.ClientApi._MultiStepClientLogin(result.data.SettingsForUser.NeedsAttribution);
            }
            if (callback != null && typeof (callback) == "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/LoginWithSteam", request, null, null, overloadCallback);
    },

    LoginWithTwitch: function (request, callback) {
        request.TitleId = PlayFab.settings.titleId != null ? PlayFab.settings.titleId : request.TitleId; if (request.TitleId == null) throw "Must be have PlayFab.settings.titleId set to call this method";

        var overloadCallback = function (result, error) {
            if (result != null && result.data.SessionTicket != null) {
                PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
                PlayFab.ClientApi._MultiStepClientLogin(result.data.SettingsForUser.NeedsAttribution);
            }
            if (callback != null && typeof (callback) == "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/LoginWithTwitch", request, null, null, overloadCallback);
    },

    RegisterPlayFabUser: function (request, callback) {
        request.TitleId = PlayFab.settings.titleId != null ? PlayFab.settings.titleId : request.TitleId; if (request.TitleId == null) throw "Must be have PlayFab.settings.titleId set to call this method";

        var overloadCallback = function (result, error) {
            if (result != null && result.data.SessionTicket != null) {
                PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
                PlayFab.ClientApi._MultiStepClientLogin(result.data.SettingsForUser.NeedsAttribution);
            }
            if (callback != null && typeof (callback) == "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/RegisterPlayFabUser", request, null, null, overloadCallback);
    },

    AddGenericID: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/AddGenericID", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    AddUsernamePassword: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/AddUsernamePassword", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetAccountInfo: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetAccountInfo", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetPlayerCombinedInfo: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetPlayerCombinedInfo", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetPlayFabIDsFromFacebookIDs: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetPlayFabIDsFromFacebookIDs", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetPlayFabIDsFromGameCenterIDs: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetPlayFabIDsFromGameCenterIDs", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetPlayFabIDsFromGenericIDs: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetPlayFabIDsFromGenericIDs", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetPlayFabIDsFromGoogleIDs: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetPlayFabIDsFromGoogleIDs", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetPlayFabIDsFromKongregateIDs: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetPlayFabIDsFromKongregateIDs", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetPlayFabIDsFromSteamIDs: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetPlayFabIDsFromSteamIDs", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetPlayFabIDsFromTwitchIDs: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetPlayFabIDsFromTwitchIDs", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    /**
     * @deprecated Please use GetPlayerCombinedInfo instead.
     */
    GetUserCombinedInfo: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetUserCombinedInfo", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    LinkAndroidDeviceID: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/LinkAndroidDeviceID", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    LinkCustomID: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/LinkCustomID", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    LinkFacebookAccount: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/LinkFacebookAccount", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    LinkGameCenterAccount: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/LinkGameCenterAccount", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    LinkGoogleAccount: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/LinkGoogleAccount", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    LinkIOSDeviceID: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/LinkIOSDeviceID", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    LinkKongregate: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/LinkKongregate", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    LinkSteamAccount: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/LinkSteamAccount", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    LinkTwitch: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/LinkTwitch", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    RemoveGenericID: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/RemoveGenericID", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    ReportPlayer: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/ReportPlayer", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    SendAccountRecoveryEmail: function (request, callback) {

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/SendAccountRecoveryEmail", request, null, null, callback);
    },

    UnlinkAndroidDeviceID: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/UnlinkAndroidDeviceID", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    UnlinkCustomID: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/UnlinkCustomID", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    UnlinkFacebookAccount: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/UnlinkFacebookAccount", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    UnlinkGameCenterAccount: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/UnlinkGameCenterAccount", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    UnlinkGoogleAccount: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/UnlinkGoogleAccount", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    UnlinkIOSDeviceID: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/UnlinkIOSDeviceID", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    UnlinkKongregate: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/UnlinkKongregate", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    UnlinkSteamAccount: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/UnlinkSteamAccount", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    UnlinkTwitch: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/UnlinkTwitch", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    UpdateUserTitleDisplayName: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/UpdateUserTitleDisplayName", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetFriendLeaderboard: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetFriendLeaderboard", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    /**
     * @deprecated Please use GetFriendLeaderboardAroundPlayer instead.
     */
    GetFriendLeaderboardAroundCurrentUser: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetFriendLeaderboardAroundCurrentUser", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetFriendLeaderboardAroundPlayer: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetFriendLeaderboardAroundPlayer", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetLeaderboard: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetLeaderboard", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    /**
     * @deprecated Please use GetLeaderboardAroundPlayer instead.
     */
    GetLeaderboardAroundCurrentUser: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetLeaderboardAroundCurrentUser", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetLeaderboardAroundPlayer: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetLeaderboardAroundPlayer", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetPlayerStatistics: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetPlayerStatistics", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetPlayerStatisticVersions: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetPlayerStatisticVersions", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetUserData: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetUserData", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetUserPublisherData: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetUserPublisherData", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetUserPublisherReadOnlyData: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetUserPublisherReadOnlyData", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetUserReadOnlyData: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetUserReadOnlyData", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    /**
     * @deprecated Please use GetPlayerStatistics instead.
     */
    GetUserStatistics: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetUserStatistics", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    UpdatePlayerStatistics: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/UpdatePlayerStatistics", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    UpdateUserData: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/UpdateUserData", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    UpdateUserPublisherData: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/UpdateUserPublisherData", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    /**
     * @deprecated Please use UpdatePlayerStatistics instead.
     */
    UpdateUserStatistics: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/UpdateUserStatistics", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetCatalogItems: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetCatalogItems", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetPublisherData: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetPublisherData", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetStoreItems: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetStoreItems", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetTime: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetTime", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetTitleData: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetTitleData", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetTitleNews: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetTitleNews", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    AddUserVirtualCurrency: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/AddUserVirtualCurrency", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    ConfirmPurchase: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/ConfirmPurchase", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    ConsumeItem: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/ConsumeItem", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetCharacterInventory: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetCharacterInventory", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetPurchase: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetPurchase", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetUserInventory: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetUserInventory", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    PayForPurchase: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/PayForPurchase", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    PurchaseItem: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/PurchaseItem", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    RedeemCoupon: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/RedeemCoupon", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    StartPurchase: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/StartPurchase", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    SubtractUserVirtualCurrency: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/SubtractUserVirtualCurrency", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    UnlockContainerInstance: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/UnlockContainerInstance", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    UnlockContainerItem: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/UnlockContainerItem", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    AddFriend: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/AddFriend", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetFriendsList: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetFriendsList", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    RemoveFriend: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/RemoveFriend", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    SetFriendTags: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/SetFriendTags", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    RegisterForIOSPushNotification: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/RegisterForIOSPushNotification", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    RestoreIOSPurchases: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/RestoreIOSPurchases", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    ValidateIOSReceipt: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/ValidateIOSReceipt", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetCurrentGames: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetCurrentGames", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetGameServerRegions: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetGameServerRegions", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    Matchmake: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/Matchmake", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    StartGame: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/StartGame", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    AndroidDevicePushNotificationRegistration: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/AndroidDevicePushNotificationRegistration", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    ValidateGooglePlayPurchase: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/ValidateGooglePlayPurchase", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    /**
     * @deprecated Please use WritePlayerEvent instead.
     */
    LogEvent: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/LogEvent", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    WriteCharacterEvent: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/WriteCharacterEvent", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    WritePlayerEvent: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/WritePlayerEvent", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    WriteTitleEvent: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/WriteTitleEvent", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    AddSharedGroupMembers: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/AddSharedGroupMembers", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    CreateSharedGroup: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/CreateSharedGroup", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetSharedGroupData: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetSharedGroupData", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    RemoveSharedGroupMembers: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/RemoveSharedGroupMembers", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    UpdateSharedGroupData: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/UpdateSharedGroupData", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    ExecuteCloudScript: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/ExecuteCloudScript", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    /**
     * @deprecated Please use ExecuteCloudScript instead.
     */
    GetCloudScriptUrl: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        var overloadCallback = function (result, error) {
            PlayFab._internalSettings.logicServerUrl = result.data.Url;
            if (callback != null && typeof (callback) == "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetCloudScriptUrl", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, overloadCallback);
    },

    /**
     * @deprecated Please use ExecuteCloudScript instead.
     */
    RunCloudScript: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetLogicServerUrl() + "/Client/RunCloudScript", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetContentDownloadUrl: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetContentDownloadUrl", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetAllUsersCharacters: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetAllUsersCharacters", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetCharacterLeaderboard: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetCharacterLeaderboard", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetCharacterStatistics: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetCharacterStatistics", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetLeaderboardAroundCharacter: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetLeaderboardAroundCharacter", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetLeaderboardForUserCharacters: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetLeaderboardForUserCharacters", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GrantCharacterToUser: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GrantCharacterToUser", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    UpdateCharacterStatistics: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/UpdateCharacterStatistics", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetCharacterData: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetCharacterData", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetCharacterReadOnlyData: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetCharacterReadOnlyData", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    UpdateCharacterData: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/UpdateCharacterData", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    ValidateAmazonIAPReceipt: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/ValidateAmazonIAPReceipt", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    AcceptTrade: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/AcceptTrade", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    CancelTrade: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/CancelTrade", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetPlayerTrades: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetPlayerTrades", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetTradeStatus: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetTradeStatus", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    OpenTrade: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/OpenTrade", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    AttributeInstall: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        var overloadCallback = function (result, error) {
            // Modify advertisingIdType:  Prevents us from sending the id multiple times, and allows automated tests to determine id was sent successfully
            PlayFab.settings.advertisingIdType += "_Successful";

            if (callback != null && typeof (callback) == "function")
                callback(result, error);
        };
        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/AttributeInstall", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, overloadCallback);
    },

    GetPlayerSegments: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetPlayerSegments", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    GetPlayerTags: function (request, callback) {
        if (PlayFab._internalSettings.sessionTicket == null) throw "Must be logged in to call this method";

        PlayFab._internalSettings.ExecuteRequest(PlayFab._internalSettings.GetServerUrl() + "/Client/GetPlayerTags", request, "X-Authorization", PlayFab._internalSettings.sessionTicket, callback);
    },

    _MultiStepClientLogin: function (needsAttribution) {
        if (needsAttribution && !PlayFab.settings.disableAdvertising && PlayFab.settings.advertisingIdType !== null && PlayFab.settings.advertisingIdValue !== null) {
            var request = {};
            if (PlayFab.settings.advertisingIdType === PlayFab.settings.AD_TYPE_IDFA)
                request.Idfa = PlayFab.settings.advertisingIdValue;
            else if (PlayFab.settings.advertisingIdType === PlayFab.settings.AD_TYPE_ANDROID_ID)
                request.Android_Id = PlayFab.settings.advertisingIdValue;
            else
                return;
            PlayFab.ClientApi.AttributeInstall(request, null);
        }
    }
};

var PlayFabClientSDK = PlayFab.ClientApi;

var smile_socre = 50;

var LoginCallback = function (result, error) {
    if (result !== null) {
        updateData();

    } else if (error !== null) {
        document.getElementById("resultOutput").innerHTML =
            "Something went wrong with your first API call.\n" +
            "Here's some debug information:\n" +
            CompileErrorReport(error);
    }
}

function updateData(){
    var StatisticNames = ["Engagement", "Interest"];
    PlayFabClientSDK.GetPlayerStatistics(StatisticNames, GetPlayerStatisticsCallback);

    Script.setTimeout(updateData, 500);
}

var GetPlayerStatisticsCallback = function (result, error) {
    if (result !== null) {
        strText = "";
        for (var i in result.data["Statistics"]) {
            obj = result.data["Statistics"][i];

            if (obj["StatisticName"] == "Engagement") {
                smile_socre = obj["Value"];
            }
        }

    }
}

var nametags = function() {
    function at(n, t) {
        print("[CtrlAltStudio nametags.js] " + n + (t !== undefined ? " " + t : ""))
    }

    function vt(n) {
        return n <= s ? .999 : n >= f ? 0 : 1 - (n - s) / (f - s)
    }

    function p() {
        var v, t, tt, y, i, p, r, w, s, b, k, u, a, d, g, st, ht, e, nt;
        for (t in n) n.hasOwnProperty(t) && (n[t].current = !1);
        for (v = AvatarList.getAvatarIdentifiers(), v.push(MyAvatar.sessionUUID), y = 0, tt = v.length; y < tt; y += 1)
            t = v[y], t !== null && (n.hasOwnProperty(t) || (n[t] = {}, n[t].overlay = Overlays.addOverlay("text3d", {
            font: {
                size: 1
            },
            color: ft,
            backgroundColor: et,
            position: Vec3.sum(MyAvatar.position, {
                x: 0,
                y: 0,
                z: 0
            }),
            visible: !1,
            isSolid: !1,
            topMargin: 0
        })), i = n[t], p = AvatarList.getAvatar(t), s = smile_socre.toString(), r = p.position, w = p.scale, e = s !== "", e && (b = Camera.position, k = {
            x: b.x - r.x,
            y: 0,
            z: b.z - r.z
        }, u = Vec3.length(k), e = w * ot <= u && u <= f), e && (ht = Quat.rotationBetween(Vec3.UNIT_Z, k), d = Overlays.textSize(o, s), a = u * (1 - .5 * u / f), g = {
            x: a * (d.width + rt),
            y: a * d.height
        }, st = {
            x: r.x,
            y: r.y + w * ut + g.y,
            z: r.z
        }), e ? (nt = vt(u), Overlays.editOverlay(i.overlay, {
            text: s,
            lineHeight: a * c,
            size: g,
            leftMargin: a * l,
            position: st,
            rotation: ht,
            parentID: t,
            textAlpha: nt,
            backgroundAlpha: nt,
            visible: !0
        })) : i.isLabelVisible && Overlays.editOverlay(i.overlay, {
            visible: !1
        }), i.displayName = s, i.isLabelVisible = e, i.current = !0);
        for (t in n) n.hasOwnProperty(t) && (n[t].current || (Overlays.deleteOverlay(n[t].overlay), delete n[t]));
        h()
    }

    function yt() {
        e = Script.setTimeout(p, nt)
    }

    function w() {
        var t;
        y || Script.clearTimeout(e);
        for (t in n) n.hasOwnProperty(t) && Overlays.deleteOverlay(n[t].overlay);
        n = {}
    }

    function b(n) {
        n !== i && (i = n, i ? yt() : w(), t && t.editProperties({
            isActive: i
        }), Settings.setValue(v, i))
    }

    function k(n) {
        var t;
        n === u && (t = Menu.isOptionChecked(u), t !== i && b(t))
    }

    function d() {
        Menu.setIsOptionChecked(u, !i)
    }

    function pt() {
        var n;
        at("Version " + g);
        n = Settings.getValue(v) !== "false";
        o = Overlays.addOverlay("text3d", {
            lineHeight: c,
            visible: !1
        });
        Menu.addMenuItem({
            menuName: a,
            menuItemName: u,
            shortcutKey: st,
            isCheckable: !0,
            isChecked: n
        });
        Menu.menuItemEvent.connect(k);
        Script.setTimeout(function() {
            r = Tablet.getTablet("com.highfidelity.interface.tablet.system");
            r && (t = r.addButton({
                icon: ct,
                activeIcon: lt,
                text: ht,
                isActive: n
            }));
            t && t.clicked.connect(d)
        }, 2500);
        b(n)
    }

    function wt() {
        y = !0;
        w();
        t && (t.clicked.disconnect(d), r && (r.removeButton(t), r = null), t = null);
        Menu.menuItemEvent.disconnect(k);
        Menu.removeMenuItem(a, u);
        Overlays.deleteOverlay(o)
    }

    PlayFab.settings.titleId = "3486";
    var loginRequest = {
        // Currently, you need to look up the correct format for this object in the API-docs:
        // https://api.playfab.com/documentation/Client/method/LoginWithCustomID
        TitleId: "3486",
        CustomId: "yuanxun",
        CreateAccount: true
    };

    PlayFabClientSDK.LoginWithCustomID(loginRequest, LoginCallback);

    var g = "1.3.1-24",
        n = {},
        e, h, o, nt = 5,
        tt = 500,
        it = 50,
        c = .018,
        l = .005,
        rt = 2 * l,
        ut = .9,
        ft = {
            red: 240,
            green: 240,
            blue: 240
        },
        et = {
            red: 32,
            green: 32,
            blue: 32
        },
        ot = 1,
        s = 3,
        f = 20,
        i = !1,
        a = "View",
        u = "eMotiv",
        st = "CTRL+N",
        ht = "eMotiv",
        ct = "http://ctrlaltstudio.com/downloads/hifi/scripts/assets/nametags-i.svg",
        lt = "http://ctrlaltstudio.com/downloads/hifi/scripts/assets/nametags-a.svg",
        r = null,
        t = null,
        v = "eMotiv Visible",
        y = !1;
    h = function() {
        e = Script.setInterval(p, tt)
    };
    pt();
    Script.scriptEnding.connect(wt)
}()