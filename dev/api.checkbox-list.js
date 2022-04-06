/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

var elements = document.body.querySelectorAll("[data-form-element-type='checkbox-list']");
for (var i = 0; i < elements.length; i++) {
    (function (element) {
        if (typeof element.dataFormAPISet !== 'undefined') {
            return;
        }
        element.dataFormAPISet = true;

        var input = element.querySelector('input[type="hidden"]');
        var checkboxes = element.querySelectorAll('input[type="checkbox"]');

        element.getValue = function () {
            return input.value;
        };

        element.setValue = function (value) {
            var valueParts = value !== null && value.length > 0 ? JSON.parse(value) : [];
            input.value = valueParts.length > 0 ? JSON.stringify(valueParts) : '';
            var setValueParts = [];
            for (var i = 0; i < checkboxes.length; i++) {
                var checkbox = checkboxes[i];
                var checkboxValue = checkbox.getAttribute('value');
                checkbox.checked = checkboxValue !== null && valueParts.indexOf(checkboxValue) !== -1;
                if (checkbox.checked) {
                    setValueParts.push(checkboxValue);
                }
            }
            var notSetValueParts = valueParts.filter(function (i) { return setValueParts.indexOf(i) < 0; });
            if (notSetValueParts.length > 0) {
                var notSetValue = notSetValueParts[0]; // support for only one
                for (var i = 0; i < checkboxes.length; i++) {
                    var checkbox = checkboxes[i];
                    var checkboxTextbox = checkbox.parentNode.querySelector('[data-form-element-component="checkbox-list-option-textbox"]');
                    if (checkboxTextbox !== null) {
                        checkbox.checked = true;
                        checkbox.value = notSetValue;
                        checkboxTextbox.value = notSetValue;
                    }
                }
            }
        };

        element.setVisibility = function (visible) {
            element.setAttribute('data-form-element-visibility', visible ? '1' : '0');
        };

        var updateInputValue = function () {
            var valueParts = [];
            for (var i = 0; i < checkboxes.length; i++) {
                var checkbox = checkboxes[i];
                if (checkbox.checked === true) {
                    var checkboxValue = checkbox.value;
                    if (checkboxValue !== null && checkboxValue !== '') {
                        valueParts.push(checkboxValue);
                    }
                }
            }
            input.value = valueParts.length > 0 ? JSON.stringify(valueParts) : '';
        };

        for (var i = 0; i < checkboxes.length; i++) {
            (function (checkbox) {
                checkbox.addEventListener('change', function () {
                    updateInputValue();
                });
                var checkboxTextbox = checkbox.parentNode.querySelector('[data-form-element-component="checkbox-list-option-textbox"]');
                if (checkboxTextbox !== null) {
                    var select = function (e) {
                        if (typeof e.keyCode !== 'undefined' && e.keyCode === 9) { // tab key
                            return;
                        }
                        setTimeout(function () { // needed for the mouse paste event
                            var inputValue = checkboxTextbox.value;
                            checkbox.value = inputValue;
                            checkbox.checked = true;
                            updateInputValue();
                        }, 1);
                    };
                    checkboxTextbox.addEventListener('change', select);
                    checkboxTextbox.addEventListener('keydown', select);
                    checkboxTextbox.addEventListener('keyup', select);
                    checkboxTextbox.addEventListener('cut', select);
                    checkboxTextbox.addEventListener('paste', select);
                }
            })(checkboxes[i]);
        }
    })(elements[i]);
}