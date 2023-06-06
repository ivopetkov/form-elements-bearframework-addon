/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

var elements = document.body.querySelectorAll("[data-form-element-type='file']");
for (var i = 0; i < elements.length; i++) {
    (function (element) {
        if (typeof element.dataFormElementAPISet !== 'undefined') {
            return;
        }
        element.dataFormElementAPISet = true;

        var clearButton = element.querySelector("[data-form-element-component='clear-button']");
        var textElement = element.querySelector("[data-form-element-component='text']");

        var input = element.querySelector("input");

        input.getFormElementContainer = function () {
            return element;
        };

        var filesUploadValues = [];

        var getUploadedFileValue = function (file) {
            for (var j = 0; j < filesUploadValues.length; j++) {
                var fileUploadValue = filesUploadValues[j];
                if (fileUploadValue[0] === file) {
                    return fileUploadValue[1];
                }
            }
            return null;
        };

        element.getValue = function () {
            var files = input.files;
            var filesCount = files.length;
            if (filesCount === 0) {
                return input.getAttribute('data-value');
            }
            var value = [];
            for (var i = 0; i < filesCount; i++) {
                var file = files[i];
                var uploadedFileValue = getUploadedFileValue(file);
                if (uploadedFileValue !== null) {
                    value.push(uploadedFileValue);
                } else {
                    value.push({
                        value: file.name,
                        filename: null,
                        size: file.size,
                        type: file.type,
                    });
                }
            }
            return JSON.stringify(value);
        };

        element.setValue = function (value) {
            if (value === '') {
                input.value = ''; // clear the files
                input.setAttribute('data-value', '');
                input.dispatchEvent(new Event('change'));
            } else {
                throw new Error('Only empty string allowed!');
            }
        };

        element.hasPendingUploads = function () {
            var files = input.files;
            var filesCount = files.length;
            for (var i = 0; i < filesCount; i++) {
                var uploadedFileValue = getUploadedFileValue(files[i]);
                if (!uploadedFileValue) {
                    return true;
                }
            }
            return false;
        };

        element.upload = function (uploadHandler, onSuccess, onAbort, onFail, onProgress) {
            var files = input.files;
            var filesCount = files.length;
            var pendingFileUploadsCount = 0;
            var uploadsProgress = [];
            for (var i = 0; i < filesCount; i++) {
                var file = files[i];
                var uploadedFileValue = getUploadedFileValue(file);
                if (uploadedFileValue === null) {
                    uploadsProgress[i] = 0;
                    pendingFileUploadsCount++;
                } else {
                    uploadsProgress[i] = 100;
                }
            }
            var callOnProgress = function () {
                if (typeof onProgress !== 'undefined') {
                    var total = 0;
                    for (var i = 0; i < filesCount; i++) {
                        total += uploadsProgress[i];
                    }
                    onProgress(total / filesCount);
                }
            }
            var uploadNextFile = function (index) {
                if (typeof files[index] === 'undefined') {
                    return;
                }
                var file = files[index];
                var uploadedFileValue = getUploadedFileValue(file);
                if (uploadedFileValue === null) {
                    uploadHandler(file,
                        function (value) { // on success
                            uploadNextFile(index + 1);
                            pendingFileUploadsCount--;
                            filesUploadValues.push([file, value]);
                            if (pendingFileUploadsCount === 0) {
                                onSuccess();
                            }
                        },
                        function () { // on abort
                            if (typeof onAbort !== 'undefined') {
                                onAbort();
                            }
                        },
                        function () { // on fail
                            if (typeof onFail !== 'undefined') {
                                onFail();
                            }
                        },
                        function (progress) { // on progress
                            uploadsProgress[index] = progress;
                            callOnProgress();
                        }
                    );
                }
            };
            uploadNextFile(0);
        };

        element.setVisibility = function (visible) {
            element.setAttribute('data-form-element-visibility', visible ? '1' : '0');
        };

        clearButton.addEventListener('click', function (event) {
            event.stopPropagation();
            event.preventDefault();
            element.setValue('');
        }, false);

        var updateUI = function () {
            var selectedFilesCount = input.files.length;
            if (selectedFilesCount === 0) {
                textElement.innerText = element.getValue().length === 0 ? 'CHOOSE_TEXT_TO_REPLACE' : '';
                clearButton.style.display = 'none';
            } else {
                if (selectedFilesCount === 1) {
                    var text = input.files[0].name;
                } else {
                    var text = 'SELECTED_FILES_COUNT_TEXT_TO_REPLACE'.replace('%s', selectedFilesCount);
                }
                textElement.innerText = text;
                clearButton.style.display = 'inline-block';
            }
        };

        input.addEventListener('change', updateUI, false);

    })(elements[i]);
}