<?php

/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

namespace IvoPetkov\BearFrameworkAddons\FormElements;

class Utilities
{
    static function getAttributesString(array $attributes): string
    {
        return implode(' ', array_map(function ($name, $value) {
            return $name . '="' . htmlentities($value) . '"';
        }, array_keys($attributes), $attributes));
    }

    static function getContainerAttributes(string $type, array $attributes): string
    {
        $containerAttributes = [];
        if ($type !== '') { // it's empty in radio-list and chechbox-list
            $containerAttributes['data-form-element-type'] = $type;
        }
        if (isset($attributes['id'])) {
            $containerAttributes['id'] = $attributes['id'];
        }
        if (isset($attributes['visibility'])) {
            $containerAttributes['data-form-element-visibility'] = $attributes['visibility'] === 'true' ? '1' : '0';
        }
        if (isset($attributes['style'])) {
            $containerAttributes['style'] = $attributes['style'];
        }
        return self::getAttributesString($containerAttributes);
    }

    static function getElementAttributes(array $attributes): string
    {
        $elementAttributes = $attributes;
        if (isset($elementAttributes['id'])) {
            unset($elementAttributes['id']);
        }
        if (isset($elementAttributes['label'])) {
            if (!isset($elementAttributes['aria-label'])) {
                $elementAttributes['aria-label'] = $elementAttributes['label'];
            }
            unset($elementAttributes['label']);
        }
        if (isset($elementAttributes['labelhtml'])) {
            if (!isset($elementAttributes['aria-label'])) {
                $elementAttributes['aria-label'] = strip_tags($elementAttributes['labelhtml']);
            }
            unset($elementAttributes['labelhtml']);
        }
        if (isset($elementAttributes['hint'])) {
            unset($elementAttributes['hint']);
        }
        if (isset($elementAttributes['hinthtml'])) {
            unset($elementAttributes['hinthtml']);
        }
        if (isset($elementAttributes['hintafter'])) {
            unset($elementAttributes['hintafter']);
        }
        if (isset($elementAttributes['hintafterhtml'])) {
            unset($elementAttributes['hintafterhtml']);
        }
        if (isset($elementAttributes['visibility'])) {
            unset($elementAttributes['visibility']);
        }
        if (isset($elementAttributes['style'])) {
            unset($elementAttributes['style']);
        }
        $temp = [];
        foreach ($elementAttributes as $name => $value) {
            if (strpos($name, 'form-elements-internal-') === false) {
                $temp[$name] = $value;
            }
        }
        $elementAttributes = $temp;
        return self::getAttributesString($elementAttributes);
    }

    static function getLabelElement(array $attributes): string
    {
        $componentName = isset($attributes['form-elements-internal-component-name']) ? $attributes['form-elements-internal-component-name'] : 'label';
        if (isset($attributes['label'])) {
            return '<span data-form-element-component="' . htmlentities($componentName) . '">' . htmlspecialchars($attributes['label']) . '</span>';
        } elseif (isset($attributes['labelhtml'])) {
            return '<span data-form-element-component="' . htmlentities($componentName) . '">' . $attributes['labelhtml'] . '</span>';
        }
        return '';
    }

    static function getHintElement(array $attributes): string
    {
        if (isset($attributes['hint'])) {
            return '<span data-form-element-component="hint">' . htmlspecialchars($attributes['hint']) . '</span>';
        } elseif (isset($attributes['hinthtml'])) {
            return '<span data-form-element-component="hint">' . $attributes['hinthtml'] . '</span>';
        }
        return '';
    }

    static function getHintAfterElement(array $attributes): string
    {
        if (isset($attributes['hintafter'])) {
            return '<span data-form-element-component="hint-after">' . htmlspecialchars($attributes['hintafter']) . '</span>';
        } elseif (isset($attributes['hintafterhtml'])) {
            return '<span data-form-element-component="hint-after">' . $attributes['hintafterhtml'] . '</span>';
        }
        return '';
    }

    static function getDefaultStyles(): string
    {
        return '[data-form-element-type][data-form-element-visibility="0"]{display:none !important;}'; // !important is needed because the element may have style="display:..."
    }
}
