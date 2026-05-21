<?php
namespace App;

use App\Encoder\EncoderInterface;

class Serializer {
    /** @var EncoderInterface[] */
    private array $encoders = [];

    public function __construct(array $encoders) {
        foreach ($encoders as $encoder) {
            if ($encoder instanceof EncoderInterface) {
                $this->encoders[] = $encoder;
            }
        }
    }

    public function decode(string $data, string $format): array {
        foreach ($this->encoders as $encoder) {
            if ($encoder->supports($format)) {
                return $encoder->decode($data, $format);
            }
        }
        throw new \InvalidArgumentException("Niewspierany format wejściowy: $format");
    }

    public function encode(array $data, string $format): string {
        foreach ($this->encoders as $encoder) {
            if ($encoder->supports($format)) {
                return $encoder->encode($data, $format);
            }
        }
        throw new \InvalidArgumentException("Niewspierany format wyjściowy: $format");
    }
}