<?php

/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

$label = (string) $component->label;
$name = (string) $component->name;
$value = (string) $component->value;
$valuePreviewUrl = (string) $component->valuePreviewUrl;

$elementID = 'fe' . md5(uniqid());

$browseText = __('ivopetkov.form-element.image.Choose');

echo '<html><head>';
//echo '<script>' . file_get_contents(__DIR__ . '/../dev/image.js') . '</script>';
//taken from dev/image.js
$js = 'var ivoPetkov=ivoPetkov||{};ivoPetkov.bearFrameworkAddons=ivoPetkov.bearFrameworkAddons||{};ivoPetkov.bearFrameworkAddons.formElementsFile=ivoPetkov.bearFrameworkAddons.formElementsFile||function(){var c=function(a){var c=a.previousSibling,b=a.previousSibling.previousSibling.previousSibling,e=b.nextSibling;if(0===c.files.length)0===a.value.length?(b.style.backgroundImage="",b.firstChild.innerText="CHOOSE_TEXT_TO_REPLACE"):b.firstChild.innerText="",e.style.display="none";else{b.style.backgroundImage="";b.firstChild.innerText="";e.style.display="inline-block";var d=new FileReader;d.addEventListener("load",function(){b.style.backgroundImage="url("+d.result+")"},!1);d.readAsDataURL(c.files[0])}};return{onClearClick:function(a){a.nextSibling.value="";a.nextSibling.nextSibling.value="";c(a.nextSibling.nextSibling)},onFilesChange:function(a){c(a.nextSibling)},onValueChange:function(a){c(a)}}}();';
$js = str_replace('CHOOSE_TEXT_TO_REPLACE', $browseText, $js);
echo '<script>' . $js . '</script>';
echo '</head><body>';
echo '<div class="ivopetkov-form-elements-element ivopetkov-form-elements-image" style="position:relative;">'; // needed for the absolute positioned clear button
if (isset($label[0])) {
    echo '<label for="' . htmlentities($elementID) . '" class="ivopetkov-form-elements-element-label ivopetkov-form-elements-image-label">' . htmlspecialchars($label) . '</label>';
}
echo '<label for="' . htmlentities($elementID) . '" class="ivopetkov-form-elements-image-element-button" style="cursor:pointer;min-width:50px;min-height:50px;overflow:hidden;display:inline-block;' . (strlen($valuePreviewUrl) > 0 ? 'background-image:url(' . $valuePreviewUrl . ');background-repeat:no-repeat;background-position:center center;background-size:cover;' : '') . '"><span style="display:flex;width:100%;height:100%;align-items:center;justify-content:center;">' . (strlen($value) > 0 ? (strlen($valuePreviewUrl) === 0 ? $value : '') : $browseText) . '</span></label>';
echo '<span onclick="ivoPetkov.bearFrameworkAddons.formElementsFile.onClearClick(this);" style="cursor:pointer;display:' . (strlen($value) > 0 ? 'inline-block' : 'none') . ';position:absolute;margin-left:-42px;width:42px;height:42px;overflow:hidden;user-select:none;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-o-user-select:none;"><span style="display:block;width:42px;height:42px;font-size:25px;color:#fff;text-shadow:#000 0 0 3px;transform:rotate(45deg);margin-top:9px;margin-left:5px;}">&#10010;</span></span>';
echo '<input name="' . htmlentities($name) . '_files" id="' . htmlentities($elementID) . '" onchange="ivoPetkov.bearFrameworkAddons.formElementsFile.onFilesChange(this);" type="file" accept=".png,.jpg,.jpeg,.gif" style="display:none;"/>';
echo '<input name="' . htmlentities($name) . '" value="' . htmlentities($value) . '" onchange="ivoPetkov.bearFrameworkAddons.formElementsFile.onValueChange(this);" style="display:none;"/>';
echo '</div>';
echo '</body></html>';
