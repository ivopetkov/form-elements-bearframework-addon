/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

var ivoPetkov = ivoPetkov || {};
ivoPetkov.bearFrameworkAddons = ivoPetkov.bearFrameworkAddons || {};
ivoPetkov.bearFrameworkAddons.formElementsFile = ivoPetkov.bearFrameworkAddons.formElementsFile || (function () {

    var updatePreviewImage = function (valueInput) {
        var fileInput = valueInput.previousSibling;
        var selectedFilesCount = fileInput.files.length;
        var previewLabel = valueInput.previousSibling.previousSibling.previousSibling;
        var clearButton = previewLabel.nextSibling;
        if (selectedFilesCount === 0) {
            if (valueInput.value.length === 0) {
                previewLabel.style.backgroundImage = '';
                previewLabel.firstChild.innerText = 'CHOOSE_TEXT_TO_REPLACE';
            } else {
                previewLabel.firstChild.innerText = '';
            }
            clearButton.style.display = 'none';
        } else {
            previewLabel.style.backgroundImage = '';
            previewLabel.firstChild.innerText = '';
            clearButton.style.display = 'inline-block';
            var reader = new FileReader();
            reader.addEventListener("load", function () {
                previewLabel.style.backgroundImage = 'url(' + reader.result + ')';
            }, false);
            reader.readAsDataURL(fileInput.files[0]);
        }
    };

    var onClearClick = function (button) {
        button.nextSibling.value = '';
        button.nextSibling.nextSibling.value = '';
        updatePreviewImage(button.nextSibling.nextSibling);
    };

    var onFilesChange = function (input) {
        updatePreviewImage(input.nextSibling);
    };

    var onValueChange = function (input) {
        updatePreviewImage(input);
    };

    return {
        'onClearClick': onClearClick,
        'onFilesChange': onFilesChange,
        'onValueChange': onValueChange
    };

}());