/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

var elements = document.body.querySelectorAll("[data-form-element-type='checkbox']");
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

        element.getValue = function () {
            if (element.isChecked()) {
                return input.value;
            }
            return null;
        };

        element.setValue = function (value) {
            var isChecked = element.isChecked();
            if (value === true || value === 1 || value === '1' || value === 'on') {
                if (!isChecked) {
                    element.check();
                }
            } else {
                if (isChecked) {
                    element.uncheck();
                }
            }
        };

        element.isChecked = function () {
            return input.checked;
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

        element.querySelector('[data-form-element-component="label"]').addEventListener('keydown', function (e) {
            if (e.keyCode === 32) {
                e.preventDefault();
                if (element.isChecked()) {
                    element.uncheck();
                } else {
                    element.check();
                }
            }
        });

        // input.focus = function () {
        //     input.nextSibling.focus();
        // };

    })(elements[i]);
}