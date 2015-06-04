var events = require('events'),
    request = require('request'),
    DOM = require('jsdom');


/**
 * Pennergame Class constructor
 *
 * This will create a Pennergame instance and log you into
 * pennergame.de. It'll emit an 'loggedin' event on success.
 *
 * user [Object] { username: 'yourusernamehere', password: 'yourpasswordherer' }
 * city [String] One of Pennergame.Cities, defaults to Hamburg
 */
function Pennergame(user, city) {
    var req, document, self = this;

    user = user;
    city = city || 'Hamburg';

    req = request.defaults({
        baseUrl: Pennergame.Cities[city],
        followAllRedirects: true,
        jar: true // Save cookies (in Memory)
    });

    /**
     * Send a POST request with "x-www-form-urlencoded" Content-Type to path
     *
     * Emits an error event if there's an error.
     *
     * path [String] The path to send the request to.
     * data [Object] The Form Data to send with the request.
     * callback [Function]
     */
    this.postIt = function (path, data, callback) {
        req.post({ url: path, form: data }, function (error, response, body) {
            if (error || response.statusCode >= 400) {
                self.emit('error', error || 'HttpError: ' + response.statusCode);
            } else {
                DOM.env(body, function (errors, window) {
                    if (errors) {
                        self.emit('error', errors);
                    } else {
                        document = window.document;
                    }
                    callback(getState());
                });
            }
        });
    };

    /**
     * Find error elements and extract their message.
     *
     * return [Array] An array of error messages.
     */
    this.getErrors = function () {
        var error_elements = document.getElementsByClassName('errmsg'),
            errors = [];

        if (error_elements) {
            // We'll need an Array to .map() over it.
            error_elements = Array.prototype.slice.call(error_elements);
            errors = error_elements.map(function (error_element) {
                return error_element.textContent.trim();
            });
        }

        return errors;
    };

    /**
     * Search the document for various Elements
     * to define in which state the Game currently is.
     *
     * return [Number] One of Pennergame.States
     */
    function getState() {
        var state = Pennergame.States.LOGGEDOUT;

        if (document) {
            if (document.getElementById('my-profile')) {
                state = Pennergame.States.LOGGEDIN;
            }

            return state;
        }

        return Pennergame.States.UNKNOWN;
    }

    // Login
    self.postIt('login/check/', user, function (state) {
        if (state <= Pennergame.States.LOGGEDOUT) {
            self.emit('error', self.getErrors());
        } else {
            self.emit('loggedin', user.username, city);
        }
    });
};

// Inherit from events.EventEmitter.
Pennergame.prototype.__proto__ = events.EventEmitter.prototype;

// The various stats our game can have.
Pennergame.States = Object.freeze({
    UNKNOWN: 0,
    LOGGEDOUT: 1,
    LOGGEDIN: 2
});

// Availabile Cities and their URLs.
Pennergame.Cities = Object.freeze({
    'Vatikan': 'http://vatikan.pennergame.de',
    'Sylt': 'http://sylt.pennergame.de',
    'Malle': 'http://malle.pennergame.de',
    'Hamburg': 'http://www.pennergame.de',
    'Hamburg Reloaded': 'http://reloaded.pennergame.de',
    'Köln': 'http://koeln.pennergame.de',
    'Berlin': 'http://berlin.pennergame.de',
    'München': 'http://muenchen.pennergame.de'
});

module.exports = Pennergame;
