<?php

/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

$attributes = $component->getAttributes();

$label = (string) $component->label;
if (isset($attributes['label'])) {
    unset($attributes['label']);
}
$hasLabel = isset($label[0]);

$value = (string) $component->value;
if (isset($attributes['value'])) {
    unset($attributes['value']);
}

$valuePreviewUrl = (string) $component->valuePreviewUrl;
if (isset($attributes['valuepreviewurl'])) {
    unset($attributes['valuepreviewurl']);
}

$name = (string) $component->name;
if (isset($attributes['name'])) {
    unset($attributes['name']);
}

$elementID = 'fe' . md5(uniqid());
$attributes['data-form-element-component'] = 'button';

if (strlen($valuePreviewUrl) > 0) {
    if (!isset($attributes['style'])) {
        $attributes['style'] = '';
    }
    $attributes['style'] .= 'background-image:url(' . $valuePreviewUrl . ');';
}

$attributesText = implode(' ', array_map(function ($name, $value) {
            return $name . '="' . htmlentities($value) . '"';
        }, array_keys($attributes), $attributes));

$browseText = __('ivopetkov.form-element.image.Choose');

echo '<html><head>';
echo '<style>'
 . '[data-form-element="image"]{position:relative;}' // needed for the absolute positioned clear button
 . '[data-form-element="image"]>[data-form-element-component="button"]{cursor:pointer;min-width:50px;min-height:50px;overflow:hidden;display:inline-block;background-repeat:no-repeat;background-position:center center;background-size:cover;}'
 . '[data-form-element="image"]>[data-form-element-component="button"]>span{display:flex;width:100%;height:100%;align-items:center;justify-content:center;}'
 . '[data-form-element="image"]>[data-form-element-component="clear-button"]{cursor:pointer;position:absolute;margin-left:-42px;width:42px;height:42px;overflow:hidden;user-select:none;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-o-user-select:none;}'
 . '[data-form-element="image"]>[data-form-element-component="clear-button"]>span{display:block;width:42px;height:42px;font-size:25px;color:#fff;text-shadow:#000 0 0 3px;transform:rotate(45deg);margin-top:9px;margin-left:5px;}'
 . '</style>';
//$js = file_get_contents(__DIR__ . '/../dev/image.js');
$js = include __DIR__ . '/image.min.js.php';
$js = str_replace('CHOOSE_TEXT_TO_REPLACE', $browseText, $js);
echo '<script>' . $js . '</script>';
echo '</head><body>';
echo '<div data-form-element="image">';
if ($hasLabel) {
    echo '<label for="' . htmlentities($elementID) . '" data-form-element-component="label">' . htmlspecialchars($label) . '</label>';
}
echo '<label for="' . htmlentities($elementID) . '" ' . $attributesText . '"><span>' . (strlen($value) > 0 ? (strlen($valuePreviewUrl) === 0 ? $value : '') : $browseText) . '</span></label>';
echo '<span data-form-element-component="clear-button" onclick="ivoPetkov.bearFrameworkAddons.formElementsFile.onClearClick(this);" style="display:' . (strlen($value) > 0 ? 'inline-block' : 'none') . ';"><span>&#10010;</span></span>';
echo '<input name="' . htmlentities($name) . '_files" id="' . htmlentities($elementID) . '" onchange="ivoPetkov.bearFrameworkAddons.formElementsFile.onFilesChange(this);" type="file" accept=".png,.jpg,.jpeg,.gif" style="display:none;"/>';
echo '<input name="' . htmlentities($name) . '" value="' . htmlentities($value) . '" onchange="ivoPetkov.bearFrameworkAddons.formElementsFile.onValueChange(this);" type="hidden"/>';
echo '</div>';
echo '</body></html>';