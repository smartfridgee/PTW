<?php
namespace App\Encoder;

class JsonEncoder implements EncoderInterface {

    public function supports(string $format): bool {
        return strtolower($format) === 'json';
    }

    public function decode(string $data, string $format): array {
        $trimmed = trim($data);

        if (!str_starts_with($trimmed, '[') && !str_starts_with($trimmed, '{')) {
            throw new \InvalidArgumentException("Wklejone dane nie wyglądają na JSON");
        }

        $decoded = json_decode($trimmed, true);
        return is_array($decoded) ? $decoded : [];
    }

    public function encode(array $data, string $format): string {
        return json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
}