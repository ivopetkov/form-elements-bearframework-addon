/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

var elements = document.body.querySelectorAll("[data-form-element-type='html']");
for (var i = 0; i < elements.length; i++) {
    (function (element) {
        if (typeof element.dataFormElementAPISet !== 'undefined') {
            return;
        }
        element.dataFormElementAPISet = true;

        var container = element.querySelector('div');

        container.getFormElementContainer = function () {
            return element;
        };

        element.getValue = function () { // Returns empty string if value is empty
            return container.innerHTML;
        };

        element.setValue = function (value) {
            container.innerHTML = value;
        };

        element.focus = function () {
            var focusTarget = element.getFocusTarget();
            if (focusTarget !== null) {
                focusTarget.focus();
            }
        };

        element.getFocusTarget = function () {
            return container;
        };

        element.setVisibility = function (visible) {
            element.setAttribute('data-form-element-visibility', visible ? '1' : '0');
        };

    })(elements[i]);
}