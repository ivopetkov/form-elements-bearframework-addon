/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

var elements = document.body.querySelectorAll("[data-form-element-type='radio-list']");
for (var i = 0; i < elements.length; i++) {
    (function (element) {
        if (typeof element.dataFormElementAPISet !== 'undefined') {
            return;
        }
        element.dataFormElementAPISet = true;

        var input = element.querySelector('input[type="hidden"]');
        var radios = element.querySelectorAll('input[type="radio"]');

        input.getFormElementContainer = function(){
            return element;
        };

        element.getValue = function () {
            return input.value;
        };

        element.setValue = function (value) {
            input.value = value;
            var radioUpdated = false;
            for (var i = 0; i < radios.length; i++) {
                var radio = radios[i];
                radio.checked = radio.getAttribute('value') === value;
                if (radio.checked) {
                    radioUpdated = true;
                }
            }
            if (!radioUpdated) {
                for (var i = 0; i < radios.length; i++) {
                    var radio = radios[i];
                    var radioTextbox = radio.parentNode.querySelector('[data-form-element-component="radio-list-option-textbox"]');
                    if (radioTextbox !== null) {
                        radio.checked = true;
                        radio.value = value;
                        radioTextbox.value = value;
                    }
                }
            }
        };

        element.setVisibility = function (visible) {
            element.setAttribute('data-form-element-visibility', visible ? '1' : '0');
        };

        for (var i = 0; i < radios.length; i++) {
            (function (radio) {
                radio.addEventListener('change', function () {
                    if (radio.checked) {
                        input.value = radio.getAttribute('value');
                    }
                });
                var radioTextbox = radio.parentNode.querySelector('[data-form-element-component="radio-list-option-textbox"]');
                if (radioTextbox !== null) {
                    var select = function (e) {
                        if (typeof e.keyCode !== 'undefined' && e.keyCode === 9) { // tab key
                            return;
                        }
                        setTimeout(function () { // needed for the mouse paste event
                            var inputValue = radioTextbox.value;
                            input.value = inputValue;
                            radio.value = inputValue;
                            radio.checked = true;
                        }, 1);
                    };
                    radioTextbox.addEventListener('change', select);
                    radioTextbox.addEventListener('keydown', select);
                    radioTextbox.addEventListener('keyup', select);
                    radioTextbox.addEventListener('cut', select);
                    radioTextbox.addEventListener('paste', select);
                }
            })(radios[i]);
        }
    })(elements[i]);
}