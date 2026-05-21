<?php
namespace App\Encoder;

class YamlEncoder implements EncoderInterface {

    public function supports(string $format): bool {
        return strtolower($format) === 'yaml';
    }

    public function decode(string $data, string $format): array {
        $lines = explode("\n", str_replace("\r\n", "\n", $data));
        $result = [];
        $currentItem = [];

        foreach ($lines as $line) {
            if (trim($line) === '') continue;

            if (preg_match('/^\s*-\s+([^:]+):\s*(.*)$/', $line, $matches)) {
                if (!empty($currentItem)) {
                    $result[] = $currentItem;
                }
                $key = trim($matches[1]);
                $val = trim($matches[2], " '\"");
                $currentItem = [$key => $val];
            } elseif (preg_match('/^\s+([^:]+):\s*(.*)$/', $line, $matches)) {
                $key = trim($matches[1]);
                $val = trim($matches[2], " '\"");
                $currentItem[$key] = $val;
            }
        }

        if (!empty($currentItem)) {
            $result[] = $currentItem;
        }

        return $result;
    }

    public function encode(array $data, string $format): string {
        $yaml = '';
        foreach ($data as $item) {
            $isFirst = true;
            foreach ($item as $key => $value) {
                if ($isFirst) {
                    $yaml .= "- " . $key . ": \"" . addcslashes($value, '"\\') . "\"\n";
                    $isFirst = false;
                } else {
                    $yaml .= "  " . $key . ": \"" . addcslashes($value, '"\\') . "\"\n";
                }
            }
        }
        return rtrim($yaml);
    }
}