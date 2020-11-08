/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

var elements = document.body.querySelectorAll("[data-form-element-type='file']");
for (var i = 0; i < elements.length; i++) {
    (function (element) {
        if (typeof element.dataFormAPISet !== 'undefined') {
            return;
        }
        element.dataFormAPISet = true;

        element.getValue = function () {
            // todo
        };

        element.setValue = function (value) {
            // todo
        };

        element.setVisibility = function (visible) {
            element.setAttribute('data-form-element-visibility', visible ? '1' : '0');
        };

        var clearButton = element.querySelector("[data-form-element-component='clear-button']");
        var previewLabel = clearButton.nextSibling;

        var inputs = element.querySelectorAll("input");
        var fileInput = inputs[0];
        var valueInput = inputs[1];

        var updateText = function () {
            var selectedFilesCount = fileInput.files.length;
            if (selectedFilesCount === 0) {
                previewLabel.firstChild.innerText = valueInput.value.length === 0 ? 'CHOOSE_TEXT_TO_REPLACE' : '';
                clearButton.style.display = 'none';
            } else {
                var file = fileInput.files[0];
                previewLabel.firstChild.innerText = file.name;
                clearButton.style.display = 'inline-block';
            }
        };

        clearButton.addEventListener('click', function (event) {
            event.stopPropagation();
            event.preventDefault();
            fileInput.value = '';
            valueInput.value = '';
            updateText();
        }, false);

        fileInput.addEventListener('change', updateText, false);

        valueInput.addEventListener('change', updateText, false);

    })(elements[i]);
}