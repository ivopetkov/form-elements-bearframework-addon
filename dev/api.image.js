/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

var elements = document.body.querySelectorAll("[data-form-element-type='image']");
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

        var updatePreviewImage = function () {
            var selectedFilesCount = fileInput.files.length;
            if (selectedFilesCount === 0) {
                previewLabel.style.backgroundImage = '';
                previewLabel.firstChild.innerText = valueInput.value.length === 0 ? 'CHOOSE_TEXT_TO_REPLACE' : '';
                clearButton.style.display = 'none';
            } else {
                previewLabel.firstChild.innerText = '';
                clearButton.style.display = 'inline-block';
                var reader = new FileReader();
                reader.addEventListener("load", function () {
                    previewLabel.style.backgroundImage = 'url(' + reader.result + ')';
                }, false);
                reader.readAsDataURL(fileInput.files[0]);
            }
        };

        clearButton.addEventListener('click', function (event) {
            event.stopPropagation();
            event.preventDefault();
            fileInput.value = '';
            valueInput.value = '';
            updatePreviewImage();
        }, false);

        fileInput.addEventListener('change', updatePreviewImage, false);

        valueInput.addEventListener('change', updatePreviewImage, false);

    })(elements[i]);
}