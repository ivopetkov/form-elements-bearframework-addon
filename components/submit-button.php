<?php

/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

$attributes = $component->getAttributes();

$text = (string) $component->text;
if (isset($attributes['text'])) {
    unset($attributes['text']);
}

$waitingText = (string) $component->waitingText;
if (isset($attributes['waitingtext'])) {
    unset($attributes['waitingtext']);
}

$waitingClass = (string) $component->waitingClass;
if (isset($attributes['waitingclass'])) {
    unset($attributes['waitingclass']);
}

$attributes['data-form-element-component'] = 'button';

$attributesText = implode(' ', array_map(function ($name, $value) {
            return $name . '="' . htmlentities($value) . '"';
        }, array_keys($attributes), $attributes));

echo '<html><head>';
echo '<style>[data-form-element="submit-button"]>[data-form-element-component="button"]{cursor:pointer;user-select:none;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-o-user-select:none;}</style>';
//$js = file_get_contents(__DIR__ . '/../dev/submit-button.js');
$js = include __DIR__ . '/submit-button.min.js.php';
echo '<script>' . $js . '</script>';
echo '</head><body>';
echo '<div data-form-element="submit-button">';
$onClick = 'ivoPetkov.bearFrameworkAddons.formElementsSubmitButton.onClick(this,' . json_encode($waitingText) . ',' . json_encode($waitingClass) . ');';
echo '<span ' . $attributesText . ' onclick="' . htmlentities($onClick) . '">' . htmlspecialchars($text) . '</span>';
echo '</div>';
echo '</body></html>';
