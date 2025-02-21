<?php

/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

use IvoPetkov\BearFrameworkAddons\FormElements\Utilities;

$attributes = $component->getAttributes();

$text = (string) $component->text;
if (isset($attributes['text'])) {
    unset($attributes['text']);
}

$onClick = (string) $component->onClick;

$attributes['data-form-element-component'] = 'button';

echo '<html><head>';
echo '<style>';
echo '[data-form-element-type="button"] [data-form-element-component="button"]{cursor:pointer;user-select:none;-moz-user-select:none;-webkit-user-select:none;}';
echo Utilities::getDefaultStyles();
echo '</style>';
echo '</head><body>';
echo '<div ' . Utilities::getContainerAttributes('button', $attributes) . '>';
echo '<span ' . Utilities::getElementAttributes($attributes) . ' onclick="' . htmlentities($onClick) . '" role="button" tabindex="0">' . htmlspecialchars($text) . '</span>';
//$js = file_get_contents(__DIR__ . '/../dev/api.button.js');
$js = include __DIR__ . '/button.min.js.php';
echo '<script>' . $js . '</script>';
echo '</div>';
echo '</body></html>';
