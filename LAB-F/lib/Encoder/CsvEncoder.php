<?php
namespace App\Encoder;

class CsvEncoder implements EncoderInterface {

    private function getSeparator(string $format): string {
        return match(strtolower($format)) {
            'ssv' => ';',
            'tsv' => "\t",
            default => ','
        };
    }

    public function supports(string $format): bool {
        return in_array(strtolower($format), ['csv', 'ssv', 'tsv']);
    }

    public function decode(string $data, string $format): array {
        $trimmed = trim($data);

        if (str_starts_with($trimmed, '[') || str_starts_with($trimmed, '{')) {
            throw new \InvalidArgumentException("Wklejone dane wyglądają na JSON, a wybrano format " . strtoupper($format));
        }
        if (str_starts_with($trimmed, '- ')) {
            throw new \InvalidArgumentException("Wklejone dane wyglądają na YAML, a wybrano format " . strtoupper($format));
        }

        $separator = $this->getSeparator($format);
        $lines = explode("\n", str_replace("\r\n", "\n", $trimmed));

        if (empty($lines) || trim($lines[0]) === '') {
            return [];
        }

        $header = str_getcsv(array_shift($lines), $separator, '"', "\\");
        $result = [];
        foreach ($lines as $line) {
            if (trim($line) === '') continue;

            $row = str_getcsv($line, $separator, '"', "\\");
            $result[] = array_combine($header, $row);
        }

        return $result;
    }

    public function encode(array $data, string $format): string {
        if (empty($data)) return '';
        $separator = $this->getSeparator($format);

        $header = array_keys($data[0]);
        $output = [];

        $output[] = implode($separator, $header);
        foreach ($data as $row) {
            $output[] = implode($separator, $row);
        }

        return implode("\n", $output);
    }
}