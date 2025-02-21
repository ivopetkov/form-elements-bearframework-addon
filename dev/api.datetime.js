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

        var showDate = [null, 'true'].indexOf(input.getAttribute('showDate')) !== -1;
        var showTime = ['true'].indexOf(input.getAttribute('showTime')) !== -1;
        var showTimeDuration = ['true'].indexOf(input.getAttribute('showTimeDuration')) !== -1;
        var showSeconds = ['true'].indexOf(input.getAttribute('showSeconds')) !== -1;
        var showYear = [null, 'true'].indexOf(input.getAttribute('showYear')) !== -1;
        var showClear = [null, 'true'].indexOf(input.getAttribute('showClear')) !== -1;
        var showOK = ['true'].indexOf(input.getAttribute('showOK')) !== -1;
        var multiple = ['', 'true'].indexOf(input.getAttribute('multiple')) !== -1;
        var allowSelect = [null, 'true'].indexOf(input.getAttribute('allowSelect')) !== -1;
        var allowSwipe = ['true'].indexOf(input.getAttribute('allowSwipe')) !== -1;

        var hoursLabel = input.getAttribute('hoursLabel');
        var minutesLabel = input.getAttribute('minutesLabel');
        var secondsLabel = input.getAttribute('secondsLabel');

        if (showTimeDuration) {
            showTime = true;
        }

        var formatDate = ivoPetkovBearFrameworkAddonsFormElementsDateTimeFormatDate;
        var leapYear = 2024;

        if (isButtonType) {
            button.addEventListener('keydown', function (event) {
                if (event.keyCode === 32) { // space
                    button.click();
                    event.preventDefault();
                    event.stopPropagation();
                }
            });
        }

        var getCurrentDateObject = function () {
            var currentDate = input.getAttribute('currentDate');
            if (currentDate !== null) {
                return new Date(currentDate);
            }
            return new Date();
        };

        var getValueParts = function (value, skipTime) {
            var result = [];
            if (value !== null && typeof value !== 'undefined') {
                var valueParts = value.split(';');
                for (var i = 0; i < valueParts.length; i++) {
                    var valuePart = valueParts[i].trim();
                    if (valuePart.length > 0) {
                        if (skipTime) {
                            var parsedDateValue = parseDateValue(valuePart);
                            result.push(parsedDateValue[0]);
                        } else {
                            result.push(valuePart);
                        }
                    }
                }
            }
            return result;
        };

        var parseDateValue = (value) => { // 2000-10-10T10:20 (date + time)
            if (value === undefined || value === null) {
                value = '';
            }
            var parts = value.split('T');
            var date = parts[0];
            var time = typeof parts[1] !== 'undefined' ? parts[1] : '';
            if (date.indexOf(':') !== -1) {
                time = date;
                date = '';
            }
            return [date, time];
        };

        var hasTime = function (value) {
            var parts = parseDateValue(value);
            return parts[1] !== '';
        };

        var getDateValueTimePart = function (value, index, defaultValue) {
            var parts = parseDateValue(value);
            if (parts[1] !== '') {
                var parts2 = parts[1].split(':');
                if (typeof parts2[index] !== 'undefined') {
                    return parseInt(parts2[index]).toString(); // remove zeroes
                }
            }
            return typeof defaultValue !== 'undefined' ? defaultValue : '';
        };

        var getContextDateFromValue = function () {
            var valueParts = getValueParts(input.value, false);
            valueParts.sort().reverse();
            var value = valueParts.length > 0 ? valueParts[0] : '';
            if (!showYear) {
                value = value.replace('0000-', leapYear + '-');
            }
            var hours = 0;
            if (showTime) {
                hours = getDateValueTimePart(value, 0, 0);
            }
            if (value !== '' && !showDate) {
                value = '1111-11-11T' + (hours > 23 ? 23 : hours).toString().padStart(2, '0') + ':' + getDateValueTimePart(value, 1, 0).toString().padStart(2, '0') + ':' + getDateValueTimePart(value, 2, 0).toString().padStart(2, '0');
            }
            var date = value !== '' ? new Date(value) : getCurrentDateObject();
            if (!showYear) {
                setDateYear(date, leapYear);
            }
            if (showTime) {
                date.setHours(hours > 23 ? 23 : hours);
                date.setMinutes(getDateValueTimePart(value, 1, 0));
                date.setSeconds(getDateValueTimePart(value, 2, 0));
            }
            return { date: date, hours: hours };
        };

        var getLastDateOfMonth = function (year, month) {
            return (new Date(year, month + 1, 0)).getDate();
        };

        var setDateMonth = function (dateObject, month) { // moves the day if not exists
            var currentDate = dateObject.getDate();
            dateObject.setDate(1);
            dateObject.setMonth(month);
            var lastDate = getLastDateOfMonth(dateObject.getFullYear(), month);
            dateObject.setDate(lastDate < currentDate ? lastDate : currentDate);
        };

        var setDateYear = function (dateObject, year) { // moves the day if not exists
            var currentDate = dateObject.getDate();
            dateObject.setDate(1);
            dateObject.setFullYear(year);
            var lastDate = getLastDateOfMonth(year, dateObject.getMonth());
            dateObject.setDate(lastDate < currentDate ? lastDate : currentDate);
        };

        var dateToString = function (dateTime) {
            var date = dateTime.date;
            var result = '';
            if (showDate) {
                result += (showYear ? date.getFullYear().toString() : '0000') + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
            }
            if (showTime) {
                if (date.getHours() > 0 || date.getMinutes() > 0 || date.getSeconds() > 0) {
                    if (showDate) {
                        result += 'T';
                    }
                    if (showTimeDuration) {
                        result += dateTime.hours;
                    } else {
                        result += date.getHours().toString().padStart(2, '0');
                    }
                    result += ':' + date.getMinutes().toString().padStart(2, '0');
                    if (showSeconds) {
                        result += ':' + date.getSeconds().toString().padStart(2, '0');
                    }
                }
            }
            return result;
        };

        var isDateInList = function (dateAsString, datesList) {
            var dateAsStringNoTime = parseDateValue(dateAsString)[0];
            for (var i = 0; i < datesList.length; i++) {
                if (dateAsStringNoTime === parseDateValue(datesList[i])[0]) {
                    return true;
                }
            }
            return false;
        };

        var contextDate = getContextDateFromValue();

        var changeContextDateMonth = (monthChange) => {
            setDateMonth(contextDate.date, contextDate.date.getMonth() + monthChange);
            if (!showYear) {
                setDateYear(contextDate.date, leapYear);
            }
            updatePicker();
        };

        var setValue = function (value, updateButtonHTML, updatePickerHTML) {
            if (input.value !== value) {
                input.value = value;
                contextDate = getContextDateFromValue();
                input.dispatchEvent(new Event('change', { 'bubbles': true }));
                if (updateButtonHTML && isButtonType) {
                    updateButtonText();
                }
                if (updatePickerHTML) {
                    updatePicker();
                }
            }
        };

        var setValueFromContextDate = function (updateButtonHTML, updatePickerHTML) {
            setValue(dateToString(contextDate), updateButtonHTML, updatePickerHTML);
        };

        var removeFromArray = (array, value) => {
            return array.filter((v) => {
                return v !== value;
            })
        };

        var fixTimeLength = function (time) { // 1:20 > 01:20
            var parts = time.split(':');
            for (var i = 0; i < parts.length; i++) {
                parts[i] = parts[i].padStart(2, '0');
            }
            return parts.join(':');
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
                            align: 'start',
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
                var valueParts = getValueParts(input.value, false);
                var textParts = [];
                for (var i = 0; i < valueParts.length; i++) {
                    var valuePart = valueParts[i].trim();
                    var formatDateOptions = [];
                    if (showDate) {
                        if (showYear) {
                            formatDateOptions.push('date');
                        } else {
                            formatDateOptions.push('monthDay');
                            formatDateOptions.push('month');
                        }
                    }
                    if (showTime || showTimeDuration) {
                        if (showDate && valuePart.indexOf('T') === -1) {
                        } else {
                            formatDateOptions.push('time');
                            if (showSeconds) {
                                formatDateOptions.push('seconds');
                            }
                        }
                        if (!showDate && valuePart !== '') {
                            valuePart = '1111-11-11T' + fixTimeLength(valuePart) + (showSeconds ? '' : ':00');
                        }
                    }
                    textParts.push(formatDate(valuePart, formatDateOptions));
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
                            align: 'center',
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

        var updatePicker = function () {
            var hasValue = input.value !== '';

            var html = '';
            if (showClear || showDate) {
                html += '<div data-form-element-component="header">';
                if (showClear) {
                    html += '<div data-form-element-component="clear-button"></div>';
                }
                if (showDate) {
                    html += '<div data-form-element-component="month-button"></div>';
                    if (showYear) {
                        html += '<div data-form-element-component="year-button"></div>';
                    }
                    html += '<div data-form-element-component="previous-button"></div>';
                    html += '<div data-form-element-component="next-button"></div>';
                }
                html += '</div>';
            }
            if (showDate) {
                html += '<div data-form-element-component="dates"></div>';
            }
            if (showTime) {
                html += '<div data-form-element-component="time">';

                html += '<div data-form-element-component="time-hours-element">';
                html += '<div data-form-element-component="time-hours-label">' + hoursLabel + '</div>';
                html += '<input type="text" data-form-element-component="time-hours-textbox"></input>';
                html += '</div>';

                html += '<div data-form-element-component="time-separator">:</div>';

                html += '<div data-form-element-component="time-minutes-element">';
                html += '<div data-form-element-component="time-minutes-label">' + minutesLabel + '</div>';
                html += '<input type="text" data-form-element-component="time-minutes-textbox"></input>';
                html += '</div>';
                if (showSeconds) {
                    html += '<div data-form-element-component="time-separator">:</div>';

                    html += '<div data-form-element-component="time-seconds-element">';
                    html += '<div data-form-element-component="time-seconds-label">' + secondsLabel + '</div>';
                    html += '<input type="text" data-form-element-component="time-seconds-textbox"></input>';
                    html += '</div>';
                }
                //html += '<div data-form-element-component="time-period-button"></div>';
                html += '</div>';
            }
            if (showOK) {
                html += '<div data-form-element-component="ok-button">OK</div>';
            }
            pickerContainer.innerHTML = html;

            if (showDate) {
                var datesContainer = pickerContainer.querySelector('[data-form-element-component="dates"]');
                var monthButton = pickerContainer.querySelector('[data-form-element-component="month-button"]');
                var yearButton = pickerContainer.querySelector('[data-form-element-component="year-button"]');
                var previousButton = pickerContainer.querySelector('[data-form-element-component="previous-button"]');
                var nextButton = pickerContainer.querySelector('[data-form-element-component="next-button"]');
            }
            if (showClear) {
                var clearButton = pickerContainer.querySelector('[data-form-element-component="clear-button"]');
            }
            if (showOK) {
                var okButton = pickerContainer.querySelector('[data-form-element-component="ok-button"]');
            }
            if (showTime) {
                var timeHoursInput = pickerContainer.querySelector('[data-form-element-component="time-hours-textbox"]');
                var timeMinutesInput = pickerContainer.querySelector('[data-form-element-component="time-minutes-textbox"]');
                if (showSeconds) {
                    var timeSecondsInput = pickerContainer.querySelector('[data-form-element-component="time-seconds-textbox"]');
                }
                //var timePeriodButton = pickerContainer.querySelector('[data-form-element-component="time-period-button"]');

                var makeTimePartOptionTooltip = function (timePartInput, type, maxValue, allowEnterOverMax, keyword1, keyword2, getPartValue, setPartValue) {
                    if (timePartInput !== null) {
                        timePartInput.value = getPartValue();
                        timePartInput.addEventListener('change', function () {
                            var value = timePartInput.value;
                            if (value !== '') {
                                var valueAsInt = parseInt(value);
                                if (isNaN(valueAsInt)) {
                                    value = 0
                                } else if (valueAsInt >= maxValue && !allowEnterOverMax) {
                                    value = maxValue;
                                }
                            }
                            setPartValue(value);
                            setValueFromContextDate(true, false);
                            timePartInput.value = value !== '' ? getPartValue() : '';
                            updatePickerDates();
                        });
                        var hideTooltipReference = null;
                        var hideTooltipIfOpeneded = function () {
                            try {
                                hideTooltipReference();
                            } catch (e) {

                            }
                        };
                        var changeValue = function (change) {
                            var value = timePartInput.value;
                            if (change > 0 && value === '') {
                                value = '0';
                            }
                            if (value !== '') {
                                var valueAsInt = parseInt(value);
                                if (!isNaN(valueAsInt)) {
                                    valueAsInt += change;
                                    if (valueAsInt < 0) {
                                        valueAsInt = 0;
                                    }
                                    if (valueAsInt > maxValue && !allowEnterOverMax) {
                                        valueAsInt = maxValue;
                                    }
                                    setPartValue(valueAsInt);
                                    setValueFromContextDate(true, false);
                                    timePartInput.value = getPartValue();
                                    updatePickerDates();
                                }
                            }
                        };
                        timePartInput.addEventListener('keydown', function (e) {
                            var keyCode = e.keyCode;
                            if (keyCode === 9) { // tab
                                hideTooltipIfOpeneded();
                            } else if (keyCode === 40) { // down
                                hideTooltipIfOpeneded();
                                changeValue(e.shiftKey ? 10 : 1);
                            } else if (keyCode === 38) { // up
                                hideTooltipIfOpeneded();
                                changeValue(e.shiftKey ? -10 : -1);
                            } else if (keyCode === 13) { // enter
                                hideTooltipIfOpeneded();
                                var nextInput = timePartInput.parentNode.nextSibling !== null ? timePartInput.parentNode.nextSibling.nextSibling.lastChild : null;
                                if (nextInput !== null) {
                                    nextInput.focus();
                                } else {
                                    timePartInput.blur();
                                    if (isButtonType) {
                                        setTooltipVisiblity(false);
                                    }
                                }
                            }
                        });
                        timePartInput.setAttribute('tabindex', '0');
                        makeTooltip(timePartInput, type, 'time-' + keyword1 + '-tooltip', function (contentContainer, hideTooltip) {
                            hideTooltipReference = hideTooltip;
                            contentContainer.setAttribute('data-form-element-component', 'time-' + keyword1);
                            for (var i = 0; i <= maxValue; i++) {
                                var optionElement = document.createElement('div');
                                optionElement.setAttribute('data-form-element-component', 'time-' + keyword2);
                                optionElement.setAttribute('data-form-element-data-value', i);
                                optionElement.innerText = ['tm', 'ts'].indexOf(type) !== -1 ? i.toString().padStart(2, '0') : i;
                                optionElement.addEventListener('click', (function (value) {
                                    return function () {
                                        hideTooltip();
                                        setPartValue(value);
                                        setValueFromContextDate(true, false);
                                        timePartInput.value = getPartValue();
                                        updatePickerDates();
                                    };
                                })(i));
                                contentContainer.appendChild(optionElement);
                            }
                            return contentContainer.querySelector('[data-form-element-data-value="' + i + '"]');
                        });
                    }
                };
                makeTimePartOptionTooltip(timeHoursInput, 'th', 23, showTimeDuration, 'hours', 'hour', function () {
                    return hasTime(input.value) ? getDateValueTimePart(input.value, 0).toString() : '';
                }, function (value) {
                    var hours = value !== '' ? parseInt(value) : 0;
                    contextDate.hours = hours;
                    contextDate.date.setHours(showTimeDuration && hours > 23 ? 23 : hours);
                });
                makeTimePartOptionTooltip(timeMinutesInput, 'tm', 59, false, 'minutes', 'minute', function () {
                    return hasTime(input.value) ? getDateValueTimePart(input.value, 1).toString().padStart(2, '0') : '';
                }, function (value) {
                    contextDate.date.setMinutes(value !== '' ? value : 0);
                });
                if (showSeconds) {
                    makeTimePartOptionTooltip(timeSecondsInput, 'ts', 59, false, 'seconds', 'second', function () {
                        return hasTime(input.value) ? getDateValueTimePart(input.value, 2).toString().padStart(2, '0') : '';
                    }, function (value) {
                        contextDate.date.setSeconds(value !== '' ? value : 0);
                    });
                }
            }

            if (showDate) {
                previousButton.addEventListener('click', function () {
                    changeContextDateMonth(-1);
                });

                nextButton.addEventListener('click', function () {
                    changeContextDateMonth(1);
                });
            }

            if (showClear) {
                clearButton.addEventListener('click', function () {
                    if (input.value === '') {
                        return;
                    }
                    contextDate.date = getCurrentDateObject();
                    contextDate.hours = 0;
                    setValue('', true, true);
                    if (isButtonType) {
                        setTooltipVisiblity(false);
                    }
                });
                clearButton.style.setProperty('opacity', hasValue ? '1' : '0');
                clearButton.style.setProperty('pointer-events', hasValue ? 'auto' : 'none');
            }

            if (showOK) {
                okButton.addEventListener('click', function () {
                    if (isButtonType) {
                        setTooltipVisiblity(false);
                    }
                });
            }

            var minMaxDates = getMinMaxDates();
            var minDate = minMaxDates[0];
            var maxDate = minMaxDates[1];

            if (showDate) {
                var contextDateMonth = contextDate.date.getMonth();

                monthButton.innerText = formatDate(contextDate.date, ['month']);
                makeTooltip(monthButton, 'm', 'months-tooltip', function (contentContainer, hideTooltip) {
                    contentContainer.setAttribute('data-form-element-component', 'months');
                    for (var i = 1; i <= 12; i++) {
                        var optionElement = document.createElement('div');
                        optionElement.setAttribute('data-form-element-component', 'month');
                        optionElement.setAttribute('data-form-element-data-value', i);
                        optionElement.innerText = formatDate('2000-' + i + '-1', ['month']);
                        optionElement.addEventListener('click', (function (month) {
                            return function () {
                                setDateMonth(contextDate.date, month - 1);
                                hideTooltip();
                                updatePicker();
                            };
                        })(i));
                        contentContainer.appendChild(optionElement);
                    }
                    return contentContainer.querySelector('[data-form-element-data-value="' + (contextDate.date.getMonth() + 1) + '"]');
                });

                if (yearButton !== null) {
                    yearButton.innerText = formatDate(contextDate.date, ['year']);
                    makeTooltip(yearButton, 'y', 'years-tooltip', function (contentContainer, hideTooltip) {
                        contentContainer.setAttribute('data-form-element-component', 'years');
                        var currentYear = (getCurrentDateObject()).getFullYear();
                        for (var i = currentYear - 200; i <= currentYear + 200; i++) {
                            var optionElement = document.createElement('div');
                            optionElement.setAttribute('data-form-element-component', 'year');
                            optionElement.setAttribute('data-form-element-data-value', i);
                            optionElement.innerText = i.toString();
                            optionElement.addEventListener('click', (function (year) {
                                return function () {
                                    setDateYear(contextDate.date, year);
                                    hideTooltip();
                                    updatePicker();
                                };
                            })(i));
                            contentContainer.appendChild(optionElement);
                        }
                        return contentContainer.querySelector('[data-form-element-data-value="' + contextDate.date.getFullYear() + '"]');
                    });
                }

                var date = new Date(contextDate.date);
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

                var currentDateAsObject = getCurrentDateObject();
                var currentDateAsString = dateToString({ date: currentDateAsObject, hours: currentDateAsObject.getHours() });
                var valueParts = getValueParts(input.value, true);

                var dateRows = showYear ? 6 : 5;
                for (var i = 0; i < dateRows * 7; i++) {
                    var disabled = false;
                    if (minDate !== null && minDate.getTime() > date.getTime()) {
                        disabled = true;
                    } else if (maxDate !== null && maxDate.getTime() < date.getTime()) {
                        disabled = true;
                    }
                    var dateAsString = dateToString({ date: date, hours: 0 });
                    var dateElement = document.createElement('div');
                    dateElement.setAttribute('data-form-element-component', 'date');
                    dateElement.setAttribute('data-form-element-data-value', dateAsString);
                    dateElement.setAttribute('data-form-element-data-day', i % 7 === 5 || i % 7 === 6 ? 'weekend' : 'weekday');
                    dateElement.setAttribute('data-form-element-data-month', date.getMonth() === contextDateMonth ? 'current' : 'other');
                    if (isDateInList(dateAsString, valueParts)) {
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
                                    var valueParts = getValueParts(input.value, true);
                                    if (valueParts.indexOf(dateAsString) === -1) {
                                        valueParts.push(dateAsString);
                                    } else {
                                        valueParts = removeFromArray(valueParts, dateAsString);
                                    }
                                    valueParts.sort();
                                    setValue(valueParts.join(';', valueParts), true, true);
                                } else {
                                    var newDate = new Date(dateAsString);
                                    newDate.setHours(contextDate.date.getHours());
                                    newDate.setMinutes(contextDate.date.getMinutes());
                                    newDate.setSeconds(contextDate.date.getSeconds());
                                    setValue(dateToString({ date: newDate }), true, true);
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

                if (allowSwipe) {
                    var swipeTouchStart = [null, null]; // x, time

                    datesContainer.addEventListener('touchstart', function (event) {
                        if (event.touches !== undefined) {
                            swipeTouchStart = [event.touches[0].clientX, (new Date()).getTime()];
                        }
                    }, false);

                    datesContainer.addEventListener('touchend', function (event) {
                        if (event.changedTouches === undefined) {
                            return;
                        }
                        var swipeTouchEnd = [event.changedTouches[0].clientX, (new Date()).getTime()];
                        if (swipeTouchEnd[1] - swipeTouchStart[1] > 500) {
                            return;
                        }
                        if (swipeTouchEnd[0] + 80 < swipeTouchStart[0]) {
                            changeContextDateMonth(1);
                        } else if (swipeTouchEnd[0] - 80 > swipeTouchStart[0]) {
                            changeContextDateMonth(-1);
                        }
                    }, false);
                }
            }

            element.dispatchEvent(new Event('pickerUpdate', { 'bubbles': false }));

        };
        if (isBlockType) {
            updatePicker();
        }

        var updatePickerDates = function () {
            var valueParts = getValueParts(input.value, true);
            var dateElements = pickerContainer.querySelectorAll('[data-form-element-data-value]');
            for (var i = 0; i < dateElements.length; i++) {
                var dateElement = dateElements[i];
                if (isDateInList(dateElement.getAttribute('data-form-element-data-value'), valueParts)) {
                    dateElement.setAttribute('data-form-element-data-selected', '');
                } else {
                    dateElement.removeAttribute('data-form-element-data-selected');
                }
            }
        };

        element.showMonth = function (month, year) {
            var newContextDate = new Date(contextDate.date.getTime());
            var hasChange = false;
            if (typeof month !== 'undefined') {
                month = parseInt(month);
                if (month >= 1 && month <= 12) {
                    month--;
                    if (newContextDate.getMonth() !== month) {
                        setDateMonth(newContextDate, month);
                        hasChange = true;
                    }
                }
            }
            if (showYear && typeof year !== 'undefined') {
                year = parseInt(year);
                if (year > 0) {
                    if (newContextDate.getFullYear() !== year) {
                        setDateYear(newContextDate, year);
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
                contextDate.date = newContextDate;
                updatePicker();
            }
        }

        element.setCurrentDate = function (date) {
            if (typeof date === "undefined" || date === null) {
                input.removeAttribute('currentDate');
            } else {
                input.setAttribute('currentDate', date);
            }
            updatePicker();
        };

        input.getFormElementContainer = function () {
            return element;
        };

        element.getName = function () {
            return input.getAttribute('name');
        };

        element.getValue = function () {
            return input.value;
        };

        element.setValue = function (value) {
            input.value = value;
            contextDate = getContextDateFromValue();
            if (isButtonType) {
                updateButtonText();
            } else {
                updatePicker();
            }
        };

        element.focus = function () {
            var focusTarget = element.getFocusTarget();
            if (focusTarget !== null) {
                focusTarget.focus();
            }
        };

        element.getFocusTarget = function () {
            if (isButtonType) {
                return button;
            }
            return null;
        };

        element.setVisibility = function (visible) {
            element.setAttribute('data-form-element-visibility', visible ? '1' : '0');
        };

    })(elements[i]);
}