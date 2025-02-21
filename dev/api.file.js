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
        var labels = element.querySelectorAll("label");
        var label = labels[labels.length - 1];

        var maxSize = input.getAttribute('data-form-element-data-max-size');
        if (maxSize === '') {
            maxSize = null;
        } else if (maxSize !== null) {
            maxSize = parseInt(maxSize);
        }

        var draggedFiles = null;
        var getSelectedFiles = function () {
            if (draggedFiles !== null) {
                return draggedFiles;
            }
            return input.files;
        };

        input.getFormElementContainer = function () {
            return element;
        };

        label.getFormElementContainer = function () {
            return element;
        };

        label.addEventListener('keydown', function (event) {
            if (event.keyCode === 13 || event.keyCode === 32) { // space and enter
                label.click();
                event.preventDefault();
                event.stopPropagation();
            }
        });

        var dragOverHandler = function (e) {
            e.preventDefault();
            e.stopPropagation();
            label.setAttribute('data-form-element-event', 'drag-over');
        };

        var dragLeaveHandler = function (e) {
            e.preventDefault();
            e.stopPropagation();
            label.removeAttribute('data-form-element-event');
        };

        label.addEventListener('dragenter', dragOverHandler, false);
        label.addEventListener('dragover', dragOverHandler, false);
        label.addEventListener('dragleave', dragLeaveHandler, false);
        label.addEventListener('drop', function (e) {
            dragLeaveHandler(e);
            var accept = input.getAttribute('accept');
            var acceptParts = accept !== null && accept !== '' ? accept.split(',') : [];
            acceptParts = acceptParts.map(function (v) {
                return v.trim().toLowerCase();
            });
            draggedFiles = [];
            var dataTransferFiles = e.dataTransfer.files;
            for (var i = 0; i < dataTransferFiles.length; i++) {
                var dataTransferFile = dataTransferFiles[i];
                var name = dataTransferFile.name.toLowerCase();
                var found = false;
                for (var acceptPart of acceptParts) {
                    if (acceptPart === name.substring(name.length - acceptPart.length)) {
                        found = true;
                        break;
                    }
                }
                if (found) {
                    draggedFiles.push(dataTransferFile);
                }
            }
            resetDraggedFilesOnInputChange = false;
            input.dispatchEvent(new Event('change', { 'bubbles': true }));
            resetDraggedFilesOnInputChange = true;
        }, false);

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

        element.getName = function () {
            return input.getAttribute('name');
        };

        element.getValue = function () {
            var files = getSelectedFiles();
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
                        value: file.name, // todo rename to name in next major version
                        filename: null,
                        size: file.size,
                        type: file.type,
                    });
                }
            }
            return JSON.stringify(value);
        };

        element.setValue = function (value) {
            if (value === null || value === '') {
                draggedFiles = null;
                input.value = ''; // clear the files
                input.setAttribute('data-value', '');
                input.dispatchEvent(new Event('change', { 'bubbles': true }));
            } else {
                throw new Error('Only empty string allowed!');
            }
        };

        element.hasValue = function () {
            return element.getValue() !== '';
        };

        element.getUploadDetails = function (value) { // returns information about the client file for the value specified (that is returned by the server)
            var files = getSelectedFiles();
            var filesCount = files.length;
            for (var i = 0; i < filesCount; i++) {
                var file = files[i];
                var uploadedFileValue = getUploadedFileValue(file);
                if (uploadedFileValue === value) {
                    return {
                        name: file.name,
                        size: file.size,
                        type: file.type,
                    }
                }
            }
            return null;
        };

        element.hasPendingUploads = function () {
            var files = getSelectedFiles();
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
            var files = getSelectedFiles();
            var filesCount = files.length;
            var pendingFileUploadsCount = 0;
            var uploadsProgress = [];
            for (var i = 0; i < filesCount; i++) {
                var file = files[i];
                if (maxSize !== null && file.size > maxSize) {
                    onFail(ivoPetkovBearFrameworkAddonsFormElementsFileGetText('ivopetkov.form-element.file.TooBig').replace('%s', ivoPetkovBearFrameworkAddonsFormElementsFileFormatBytes(maxSize)));
                    return;
                }
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
                        function (errorMessage) { // on abort
                            if (typeof onAbort !== 'undefined') {
                                onAbort(errorMessage);
                            }
                        },
                        function (errorMessage) { // on fail
                            if (typeof onFail !== 'undefined') {
                                onFail(errorMessage);
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

        element.focus = function () {
            var focusTarget = element.getFocusTarget();
            if (focusTarget !== null) {
                focusTarget.focus();
            }
        };

        element.getFocusTarget = function () {
            return label;
        };

        element.setVisibility = function (visible) {
            element.setAttribute('data-form-element-visibility', visible ? '1' : '0');
        };

        if (clearButton !== null) {
            clearButton.addEventListener('click', function (event) {
                event.stopPropagation();
                event.preventDefault();
                element.setValue('');
            }, false);
        }

        var updateUI = function () {
            var selectedFiles = getSelectedFiles();
            var selectedFilesCount = selectedFiles.length;
            if (selectedFilesCount === 0) {
                textElement.innerText = element.getValue().length === 0 ? 'CHOOSE_TEXT_TO_REPLACE' : '';
                if (clearButton !== null) {
                    clearButton.style.display = 'none';
                }
            } else {
                if (selectedFilesCount === 1) {
                    var text = selectedFiles[0].name;
                } else {
                    var text = 'SELECTED_FILES_COUNT_TEXT_TO_REPLACE'.replace('%s', selectedFilesCount);
                }
                textElement.innerText = text;
                if (clearButton !== null) {
                    clearButton.style.display = 'inline-block';
                }
            }
        };

        var resetDraggedFilesOnInputChange = true;
        input.addEventListener('change', function () {
            if (resetDraggedFilesOnInputChange) {
                draggedFiles = null;
            }
            updateUI();
            if (element.hasValue()) {
                input.setAttribute('data-has-value', 'true');
            } else {
                input.removeAttribute('data-has-value');
            }
            setTimeout(updateUI, 1); // Needed for form.reset();
        }, false);

    })(elements[i]);
}