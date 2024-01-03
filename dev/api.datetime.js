/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

var elements = document.body.querySelectorAll("[data-form-element-type='datetime']");
for (var i = 0; i < elements.length; i++) {
    (function (element) {
        if (typeof element.dataFormElementAPISet !== 'undefined') {
            return;
        }
        element.dataFormElementAPISet = true;

        var input = element.querySelector('input');
        var button = element.querySelector('[data-form-element-component="button"]');
        var pickerContainer = element.querySelector('[data-form-element-component="picker"]');
        var isButtonType = button !== null;
        var isBlockType = pickerContainer !== null;

        var showTime = input.getAttribute('showTime') !== 'false'; // todo
        var showYear = input.getAttribute('showYear') !== 'false';
        var showClear = input.getAttribute('showClear') !== 'false';
        var multiple = ['true', ''].indexOf(input.getAttribute('multiple')) !== -1;
        var allowSelect = input.getAttribute('allowSelect') !== 'false';

        var formatDate = ivoPetkovBearFrameworkAddonsFormElementsDateTimeFormatDate;
        var leapYear = 2024;

        if (isButtonType) {
            button.addEventListener('keydown', function (event) {
                if (event.keyCode === 13) {
                    button.click();
                }
            });
        }

        var getValueParts = function (value) {
            var result = [];
            if (value !== null && typeof value !== 'undefined') {
                var valueParts = value.split(';');
                for (var i = 0; i < valueParts.length; i++) {
                    var valuePart = valueParts[i].trim();
                    if (valuePart.length > 0) {
                        result.push(valuePart);
                    }
                }
            }
            return result;
        }

        var getContextDateFromValue = function () {
            var valueParts = getValueParts(input.value);
            valueParts.sort().reverse();
            var value = valueParts.length > 0 ? valueParts[0] : '';
            if (!showYear) {
                value = value.replace('0000-', leapYear + '-');
            }
            var date = value !== '' ? new Date(value) : new Date();
            if (!showYear) {
                date.setFullYear(leapYear);
            }
            return date;
        };

        var contextDate = getContextDateFromValue();

        var changeContextDateMonth = (monthChange) => {
            contextDate.setMonth(contextDate.getMonth() + monthChange);
            if (!showYear) {
                contextDate.setFullYear(leapYear);
            }
            updatePicker();
        };

        var dateToString = function (date, hasYear) {
            return (hasYear ? date.getFullYear().toString() : '0000') + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
        };

        var setValue = function (value) {
            if (input.value !== value) {
                input.value = value;
                input.dispatchEvent(new Event('change', { 'bubbles': true }));
                if (isButtonType) {
                    updateButtonText();
                }
                updatePicker();
            }
        };

        var removeFromArray = (array, value) => {
            return array.filter((v) => {
                return v !== value;
            })
        };

        var tooltipID = null;
        var getTooltip = function (callback, type) {
            if (typeof type === 'undefined') {
                type = null;
            }
            clientPackages.get('tooltip').then(function (tooltip) {
                if (tooltipID === null) {
                    tooltipID = tooltip.generateID();
                }
                callback(tooltip, tooltipID + (type !== null ? '$' + type : ''));
            });
        };

        if (isButtonType) {
            var tooltipContent = document.createElement('div');
            tooltipContent.innerHTML = '<div data-form-element-component="picker"></div>';
            pickerContainer = tooltipContent.querySelector('[data-form-element-component="picker"]');

            var setTooltipVisiblity = null;

            getTooltip(function (tooltip, tooltipID) {

                var isTooltipVisible = function () {
                    return tooltip.isVisible(tooltipID);
                };

                tooltip.addClickListener(button, function () {
                    if (isTooltipVisible()) {
                        setTooltipVisiblity(false);
                    } else {
                        contextDate = getContextDateFromValue();
                        updatePicker();
                        setTooltipVisiblity(true);
                    }
                });

                setTooltipVisiblity = function (visible) {
                    if (visible === isTooltipVisible()) {
                        return;
                    }
                    if (visible) {
                        tooltip.show(tooltipID, button, pickerContainer, {
                            showArrow: false,
                            align: 'start',
                            contentSpacing: 2,
                            preferedPositions: ['bottom', 'top', 'left', 'right'],
                            contentContainer: input.nextSibling,
                            onBeforeShow: function (element) {
                                element.setAttribute('data-form-element-component', 'picker-tooltip');
                            },
                            onHide: function () {
                                element.removeAttribute('data-form-element-data-opened', '');
                            }
                        });
                        element.setAttribute('data-form-element-data-opened', '');
                    } else {
                        tooltip.hide(tooltipID);
                    }
                };
            });

            var updateButtonText = function () {
                var valueParts = getValueParts(input.value);
                var textParts = [];
                for (var i = 0; i < valueParts.length; i++) {
                    var valuePart = valueParts[i].trim();
                    textParts.push(formatDate(valuePart, showYear ? ['date'] : ['monthDay', 'month']));
                }
                button.innerText = textParts.join(', ');
            };
        }

        var getMinMaxDates = function () {
            var minDate = input.getAttribute('min');
            minDate = minDate !== null ? new Date(minDate) : null;

            var maxDate = input.getAttribute('max');
            maxDate = maxDate !== null ? new Date(maxDate) : null;
            return [minDate, maxDate];
        };

        var updatePicker = function () {
            var hasValue = input.value !== '';

            var html = '<div data-form-element-component="header">';
            if (showClear) {
                html += '<div data-form-element-component="clear-button"></div>';
            }
            html += '<div data-form-element-component="month-button"></div>';
            if (showYear) {
                html += '<div data-form-element-component="year-button"></div>';
            }
            html += '<div data-form-element-component="previous-button"></div>';
            html += '<div data-form-element-component="next-button"></div>';
            html += '</div>';
            html += '<div data-form-element-component="dates"></div>';
            pickerContainer.innerHTML = html;

            var datesContainer = pickerContainer.querySelector('[data-form-element-component="dates"]');
            var monthButton = pickerContainer.querySelector('[data-form-element-component="month-button"]');
            var yearButton = pickerContainer.querySelector('[data-form-element-component="year-button"]');
            var previousButton = pickerContainer.querySelector('[data-form-element-component="previous-button"]');
            var nextButton = pickerContainer.querySelector('[data-form-element-component="next-button"]');
            if (showClear) {
                var clearButton = pickerContainer.querySelector('[data-form-element-component="clear-button"]');
            }

            previousButton.addEventListener('click', function () {
                changeContextDateMonth(-1);
            });

            nextButton.addEventListener('click', function () {
                changeContextDateMonth(1);
            });

            if (showClear) {
                clearButton.addEventListener('click', function () {
                    if (input.value === '') {
                        return;
                    }
                    contextDate = new Date();
                    setValue('');
                    if (isButtonType) {
                        setTooltipVisiblity(false);
                    }
                });
                clearButton.style.setProperty('opacity', hasValue ? '1' : '0');
                clearButton.style.setProperty('pointer-events', hasValue ? 'auto' : 'none');
            }

            var minMaxDates = getMinMaxDates();
            var minDate = minMaxDates[0];
            var maxDate = minMaxDates[1];

            var contextDateMonth = contextDate.getMonth();

            var makeTooltip = function (targetButton, type, componentName, contentCallback) {
                getTooltip(function (tooltip, tooltipID) {
                    tooltip.addClickListener(targetButton, function () {
                        if (tooltip.isVisible(tooltipID)) {
                            tooltip.hide(tooltipID);
                        } else {
                            var contentContainer = document.createElement('div');
                            var selectedElement = contentCallback(contentContainer, function () {
                                tooltip.hide(tooltipID);
                            });
                            tooltip.show(tooltipID, targetButton, contentContainer, {
                                showArrow: false,
                                align: 'center',
                                contentSpacing: 2,
                                preferedPositions: ['bottom', 'top', 'left', 'right'],
                                contentContainer: pickerContainer,
                                onBeforeShow: function (element) {
                                    element.setAttribute('data-form-element-component', componentName);
                                },
                                onHide: function () {
                                    targetButton.removeAttribute('data-form-element-data-opened', '');
                                }
                            });
                            if (selectedElement !== null) {
                                selectedElement.setAttribute('data-form-element-data-selected', '');
                                var elementParent = selectedElement.parentNode;
                                var elementRect = selectedElement.getBoundingClientRect();
                                var elementParentRect = elementParent.getBoundingClientRect();
                                elementParent.scrollTop = Math.round(Math.abs(elementRect.y - elementParentRect.y) - (elementParentRect.height - elementRect.height) / 2);
                            }
                            targetButton.setAttribute('data-form-element-data-opened', '');
                        }
                    });
                }, type);
            };

            monthButton.innerText = formatDate(contextDate, ['month']);
            makeTooltip(monthButton, 'm', 'months-tooltip', function (contentContainer, hideTooltip) {
                contentContainer.setAttribute('data-form-element-component', 'months');
                for (var i = 1; i <= 12; i++) {
                    var monthElement = document.createElement('div');
                    monthElement.setAttribute('data-form-element-component', 'month');
                    monthElement.setAttribute('data-form-element-data-value', i);
                    monthElement.innerText = formatDate('2000-' + i + '-1', ['month']);
                    monthElement.addEventListener('click', (function (month) {
                        return function () {
                            contextDate.setMonth(month - 1);
                            hideTooltip();
                            updatePicker();
                        };
                    })(i));
                    contentContainer.appendChild(monthElement);
                }
                return contentContainer.querySelector('[data-form-element-data-value="' + (contextDate.getMonth() + 1) + '"]');
            });

            if (yearButton !== null) {
                yearButton.innerText = formatDate(contextDate, ['year']);
                makeTooltip(yearButton, 'y', 'years-tooltip', function (contentContainer, hideTooltip) {
                    contentContainer.setAttribute('data-form-element-component', 'years');
                    var currentYear = (new Date()).getFullYear();
                    for (var i = currentYear - 200; i <= currentYear + 200; i++) {
                        var yearElement = document.createElement('div');
                        yearElement.setAttribute('data-form-element-component', 'year');
                        yearElement.setAttribute('data-form-element-data-value', i);
                        yearElement.innerText = i.toString();
                        yearElement.addEventListener('click', (function (year) {
                            return function () {
                                contextDate.setFullYear(year);
                                hideTooltip();
                                updatePicker();
                            };
                        })(i));
                        contentContainer.appendChild(yearElement);
                    }
                    return contentContainer.querySelector('[data-form-element-data-value="' + contextDate.getFullYear() + '"]');
                });
            }

            var date = new Date(contextDate);
            date.setDate(1);
            if (showYear) {
                var firstDateWeekDay = date.getDay();
                if (firstDateWeekDay === 0) {
                    firstDateWeekDay = 7;
                }
                date.setDate(date.getDate() + 1 - firstDateWeekDay);
            }

            if (showYear) {
                var days = [
                    formatDate('2000-01-03', ['weekDayShort']), // Mon
                    formatDate('2000-01-04', ['weekDayShort']), // Tue
                    formatDate('2000-01-05', ['weekDayShort']), // Wed
                    formatDate('2000-01-06', ['weekDayShort']), // Thu
                    formatDate('2000-01-07', ['weekDayShort']), // Fri
                    formatDate('2000-01-08', ['weekDayShort']), // Sat
                    formatDate('2000-01-09', ['weekDayShort']), // Sun
                ];
                for (var i = 0; i < 7; i++) {
                    var dateElement = document.createElement('div');
                    dateElement.setAttribute('data-form-element-component', 'day');
                    dateElement.innerText = days[i];
                    datesContainer.appendChild(dateElement);
                }
            }

            var currentDateAsString = dateToString(new Date(), showYear);
            var valueParts = getValueParts(input.value);

            var dateRows = showYear ? 6 : 5;
            for (var i = 0; i < dateRows * 7; i++) {
                var disabled = false;
                if (minDate !== null && minDate.getTime() > date.getTime()) {
                    disabled = true;
                } else if (maxDate !== null && maxDate.getTime() < date.getTime()) {
                    disabled = true;
                }
                var dateAsString = dateToString(date, showYear);
                var dateElement = document.createElement('div');
                dateElement.setAttribute('data-form-element-component', 'date');
                dateElement.setAttribute('data-form-element-data-value', dateAsString);
                dateElement.setAttribute('data-form-element-data-day', i % 7 === 5 || i % 7 === 6 ? 'weekend' : 'weekday');
                dateElement.setAttribute('data-form-element-data-month', date.getMonth() === contextDateMonth ? 'current' : 'other');
                if (valueParts.indexOf(dateAsString) !== -1) {
                    dateElement.setAttribute('data-form-element-data-selected', '');
                }
                if (dateAsString === currentDateAsString) {
                    dateElement.setAttribute('data-form-element-data-today', '');
                }
                dateElement.innerText = date.getDate().toString();
                if (disabled) {
                    dateElement.setAttribute('data-form-element-data-disabled', '');
                } else {
                    dateElement.addEventListener('click', (function (dateAsString) {
                        return function () {
                            if (!allowSelect) {
                                return;
                            }
                            if (multiple) {
                                var valueParts = getValueParts(input.value);
                                if (valueParts.indexOf(dateAsString) === -1) {
                                    valueParts.push(dateAsString);
                                } else {
                                    valueParts = removeFromArray(valueParts, dateAsString);
                                }
                                valueParts.sort();
                                setValue(valueParts.join(';', valueParts));
                                updatePicker();
                            } else {
                                setValue(dateAsString);
                                if (isButtonType) {
                                    setTooltipVisiblity(false);
                                }
                            }
                        };
                    })(dateAsString));
                }
                datesContainer.appendChild(dateElement);
                date.setDate(date.getDate() + 1);
            }

            element.dispatchEvent(new Event('pickerUpdate', { 'bubbles': false }));

        };
        if (isBlockType) {
            updatePicker();
        }

        element.showMonth = function (month, year) {
            var newContextDate = new Date(contextDate.getTime());
            var hasChange = false;
            if (typeof month !== 'undefined') {
                month = parseInt(month);
                if (month >= 1 && month <= 12) {
                    month--;
                    if (newContextDate.getMonth() !== month) {
                        newContextDate.setMonth(month);
                        hasChange = true;
                    }
                }
            }
            if (showYear && typeof year !== 'undefined') {
                year = parseInt(year);
                if (year > 0) {
                    if (newContextDate.getFullYear() !== year) {
                        newContextDate.setFullYear(year);
                        hasChange = true;
                    }
                }
            }
            var minMaxDates = getMinMaxDates();
            var minDate = minMaxDates[0];
            var maxDate = minMaxDates[1];
            if (minDate !== null && minDate.getTime() > newContextDate.getTime()) {
                newContextDate = minDate;
                hasChange = true;
            } else if (maxDate !== null && maxDate.getTime() < newContextDate.getTime()) {
                newContextDate = maxDate;
                hasChange = true;
            }
            if (hasChange) {
                contextDate = newContextDate;
                updatePicker();
            }
        }

        input.getFormElementContainer = function () {
            return element;
        };

        element.getValue = function () {
            return input.value;
        };

        element.setValue = function (value) {
            input.value = value;
            if (isButtonType) {
                updateButtonText();
            }
        };

        element.setVisibility = function (visible) {
            element.setAttribute('data-form-element-visibility', visible ? '1' : '0');
        };

    })(elements[i]);
}