/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

// The input's change event bubbles to the container

var elements = document.body.querySelectorAll("[data-form-element-type='textbox']");
for (var i = 0; i < elements.length; i++) {
    (function (element) {
        if (typeof element.dataFormElementAPISet !== 'undefined') {
            return;
        }
        element.dataFormElementAPISet = true;

        var input = element.querySelector('input');

        input.getFormElementContainer = function () {
            return element;
        };

        element.getName = function () {
            return input.getAttribute('name');
        };

        element.getValue = function () { // Returns empty string if the input is empty
            return input.value;
        };

        element.setValue = function (value) {
            input.value = value;
        };

        element.focus = function () {
            var focusTarget = element.getFocusTarget();
            if (focusTarget !== null) {
                focusTarget.focus();
            }
        };

        element.getFocusTarget = function () {
            return input;
        };

        element.setVisibility = function (visible) {
            element.setAttribute('data-form-element-visibility', visible ? '1' : '0');
        };

        element.isActive = function () {
            return document.activeElement === input;
        };

    })(elements[i]);
}