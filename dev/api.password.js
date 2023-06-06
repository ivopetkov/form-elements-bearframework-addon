/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

var elements = document.body.querySelectorAll("[data-form-element-type='password']");
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