/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

// The textarea's change event bubbles to the container

var elements = document.body.querySelectorAll("[data-form-element-type='textarea']");
for (var i = 0; i < elements.length; i++) {
    (function (element) {
        if (typeof element.dataFormElementAPISet !== 'undefined') {
            return;
        }
        element.dataFormElementAPISet = true;

        var textarea = element.querySelector('textarea');

        textarea.getFormElementContainer = function () {
            return element;
        };

        element.getValue = function () {  // Returns empty string if the textarea is empty
            return textarea.value;
        };

        element.setValue = function (value) {
            textarea.value = value;
        };

        element.setVisibility = function (visible) {
            element.setAttribute('data-form-element-visibility', visible ? '1' : '0');
        };

        element.isActive = function () {
            return document.activeElement === textarea;
        };

    })(elements[i]);
}