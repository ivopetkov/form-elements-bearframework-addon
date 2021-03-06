/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

var elements = document.body.querySelectorAll("[data-form-element-type='select']");
for (var i = 0; i < elements.length; i++) {
    (function (element) {
        if (typeof element.dataFormAPISet !== 'undefined') {
            return;
        }
        element.dataFormAPISet = true;

        var input = element.querySelector('select');

        element.getValue = function () {
            return input.value;
        };

        element.setValue = function (value) {
            input.value = value;
        };

        element.setVisibility = function (visible) {
            element.setAttribute('data-form-element-visibility', visible ? '1' : '0');
        };
    })(elements[i]);
}