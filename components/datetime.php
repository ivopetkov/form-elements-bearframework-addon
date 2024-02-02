<?php

/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

use BearFramework\App;
use IvoPetkov\BearFrameworkAddons\FormElements\Utilities;

$app = App::get();

$attributes = $component->getAttributes();

$type = 'button'; // button (default), block
if (isset($attributes['type'])) {
    $type = (string)$attributes['type'];
    unset($attributes['type']);
}

$value = isset($attributes['value']) ? (string)$attributes['value'] : '';
$showDate = !isset($attributes['showdate']) || (isset($attributes['showdate']) && $attributes['showdate'] === 'true');
$showYear = !isset($attributes['showyear']) || (isset($attributes['showyear']) && $attributes['showyear'] === 'true');
$showTime = isset($attributes['showtime']) && $attributes['showtime'] === 'true';
$showSeconds = isset($attributes['showseconds']) && $attributes['showseconds'] === 'true';
$showTimeDuration = isset($attributes['showtimeduration']) && $attributes['showtimeduration'] === 'true';

if (!isset($attributes['hourslabel'])) {
    $attributes['hourslabel'] = __('ivopetkov.form-element.datetime.Hours');
}
if (!isset($attributes['minuteslabel'])) {
    $attributes['minuteslabel'] = __('ivopetkov.form-element.datetime.Minutes');
}
if (!isset($attributes['secondslabel'])) {
    $attributes['secondslabel'] = __('ivopetkov.form-element.datetime.Seconds');
}

echo '<html><head>';
echo '<link rel="client-packages-embed" name="tooltip">';
echo '<style>'
    . Utilities::getDefaultStyles()
    . '[data-form-element-type="datetime"]{position:relative;user-select:none;}'
    . '[data-form-element-type="datetime"] [data-form-element-component="button"]{display:inline-block;min-width:20px;min-height:20px;}'
    . '[data-form-element-type="datetime"] [data-form-element-component="header"]{display:flex;flex-direction:row;}'
    . '[data-form-element-type="datetime"] [data-form-element-component="previous-button"],'
    . '[data-form-element-type="datetime"] [data-form-element-component="next-button"],'
    . '[data-form-element-type="datetime"] [data-form-element-component="clear-button"]{cursor:pointer;display:inline-block;min-width:10px;min-height:10px;}'
    . '[data-form-element-type="datetime"] [data-form-element-component="month-button"],'
    . '[data-form-element-type="datetime"] [data-form-element-component="year-button"]{cursor:pointer;}'
    . '[data-form-element-type="datetime"] [data-form-element-component="day"]{display:inline-block;width:calc(100% / 7);}'
    . '[data-form-element-type="datetime"] [data-form-element-component="date"]{cursor:default;display:inline-block;width:calc(100% / 7);}' //height:40px;margin:8px max(0px,calc((100% - 7*44px)/14));
    . '[data-form-element-type="datetime"] [data-form-element-component="date"]:not([data-form-element-data-disabled]){cursor:pointer;}'
    . '[data-form-element-type="datetime"] [data-form-element-component="months"],'
    . '[data-form-element-type="datetime"] [data-form-element-component="years"],'
    . '[data-form-element-type="datetime"] [data-form-element-component="time-hours"],'
    . '[data-form-element-type="datetime"] [data-form-element-component="time-minutes"],'
    . '[data-form-element-type="datetime"] [data-form-element-component="time-seconds"]{overflow:auto;overscroll-behavior:none;height:200px;}'
    . '[data-form-element-type="datetime"] [data-form-element-component="month"],'
    . '[data-form-element-type="datetime"] [data-form-element-component="year"],'
    . '[data-form-element-type="datetime"] [data-form-element-component="time-hour"],'
    . '[data-form-element-type="datetime"] [data-form-element-component="time-minute"],'
    . '[data-form-element-type="datetime"] [data-form-element-component="time-second"]{cursor:pointer;}'
    . '</style>';

echo '<script>'
    . 'var ivoPetkovBearFrameworkAddonsFormElementsDateTimeFormatDate=' . $app->localization->getFormatDateJsFunction() . ';'
    . '</script>';

echo '</head><body>';
echo '<div ' . Utilities::getContainerAttributes('datetime', $attributes) . '>';
echo Utilities::getLabelElement($attributes);
echo Utilities::getHintElement($attributes);
if ($type === 'button') {

    $fixTimeLength = function ($time) { // 1:20 > 01:20
        $parts = explode(':', $time);
        for ($i = 0; $i < sizeof($parts); $i++) {
            $parts[$i] = str_pad($parts[$i], 2, '0', STR_PAD_LEFT);
        }
        return implode(':', $parts);
    };

    $formatDateValue = $value;
    $formatDateOptions = [];
    if ($showDate) {
        if ($showYear) {
            $formatDateOptions[] = 'date';
        } else {
            $formatDateOptions[] = 'monthDay';
            $formatDateOptions[] = 'month';
        }
    }
    if ($showTime || $showTimeDuration) {
        if ($showDate && strpos($formatDateValue, 'T') === false) {
        } else {
            $formatDateOptions[] = 'time';
        }
        if (!$showDate && $formatDateValue !== '') {
            $formatDateValue = '1111-11-11T' . $fixTimeLength($formatDateValue) . ($showSeconds ? '' : ':00');
        }
    }
    echo '<span data-form-element-component="button" role="button" tabindex="0">' . ($formatDateValue !== '' ? $app->localization->formatDate($formatDateValue, $formatDateOptions) : '') . '</span>';
}
echo '<input type="hidden"' . Utilities::getElementAttributes($attributes) . '/>';
if ($type === 'button') {
    echo '<div></div>';
} else if ($type === 'block') {
    echo '<div data-form-element-component="picker"></div>';
}
echo Utilities::getHintAfterElement($attributes);
//$js = file_get_contents(__DIR__ . '/../dev/api.datetime.js');
$js = include __DIR__ . '/datetime.api.min.js.php';
echo '<script>' . $js . '</script>';
echo '</div>';
echo '</body></html>';
