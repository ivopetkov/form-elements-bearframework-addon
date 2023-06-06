/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

var elements = document.body.querySelectorAll("[data-form-element-type='radio']");
for (var i = 0; i < elements.length; i++) {
    (function (element) {
        if (typeof element.dataFormElementAPISet !== 'undefined') {
            return;
        }
        element.dataFormElementAPISet = true;

        var input = element.querySelector('input');

        input.getFormElementContainer = function(){
            return element;
        };

        element.isChecked = function () {
            return input.checked;
        };

        element.getValue = function () {
            return input.value;
        };

        element.setValue = function (value) {
            input.value = value;
        };

        element.check = function () {
            if (!input.checked) {
                input.checked = true;
                input.dispatchEvent(new Event('change', { 'bubbles': true }));
            }
        };

        element.uncheck = function () {
            if (input.checked) {
                input.checked = false;
                input.dispatchEvent(new Event('change', { 'bubbles': true }));
            }
        };

        element.setVisibility = function (visible) {
            element.setAttribute('data-form-element-visibility', visible ? '1' : '0');
        };

        var selectOnKeyPress = function (previous) {
            var select = function (elementInput) {
                if (input !== elementInput) {
                    element.uncheck();
                    elementInput.parentNode.parentNode.check();
                    elementInput.nextSibling.focus();
                }
            };
            var allRadios = document.querySelectorAll('[name="' + input.name + '"]');
            var allRadiosCount = allRadios.length;
            for (var i = 0; i < allRadiosCount; i++) {
                if (allRadios[i] === input) {
                    if (previous) {
                        if (i > 0) {
                            select(allRadios[i - 1]);
                        }
                    } else {
                        if (typeof allRadios[i + 1] !== 'undefined') {
                            select(allRadios[i + 1]);
                        }
                    }
                }
            }
        };

        var setTabIndex = function (input, value) {
            input.setAttribute('tabindex', value);
        };

        input.addEventListener('change', function () {
            //setTabIndex(input, input.checked ? '0' : '-1');
            var otherRadioInputsWithSameName = document.body.querySelectorAll("[data-form-element-type='radio'] input[name='" + input.name + "']");
            for (var i = 0; i < otherRadioInputsWithSameName.length; i++) {
                var otherRadioInputWithSameName = otherRadioInputsWithSameName[i];
                setTabIndex(otherRadioInputWithSameName, otherRadioInputWithSameName.checked ? '0' : '-1');
            }
        });

        input.focus = function () {
            input.nextSibling.focus();
        };

        element.querySelector('[data-form-element-component="label"]').addEventListener('keydown', function (e) {
            var keyCode = e.keyCode;
            if (keyCode === 37 || keyCode === 38) {
                e.preventDefault();
                selectOnKeyPress(true);
            } else if (keyCode === 39 || keyCode === 40) {
                e.preventDefault();
                selectOnKeyPress(false);
            }
        });

        var otherRadioInputsWithSameName = document.body.querySelectorAll("[data-form-element-type='radio'] input[name='" + input.name + "']");
        var hasChecked = false;
        for (var i = 0; i < otherRadioInputsWithSameName.length; i++) {
            var otherRadioInputWithSameName = otherRadioInputsWithSameName[i];
            if (otherRadioInputWithSameName.checked) {
                hasChecked = true;
                setTabIndex(otherRadioInputWithSameName, '0');
            }
        }
        if (!hasChecked) {
            setTabIndex(otherRadioInputsWithSameName[0], '0');
        }
    })(elements[i]);
}