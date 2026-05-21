<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Bastian Wierzchnicki (57947) - PTW LAB F</title>
    <link rel="stylesheet" href="/templates/style.css">
</head>
<body>
    <div class="wrapper">
        <h2>Konwenter</h2>
        <form method="POST">
            <div class="flex-container">
                <div class="flex-child">
                    <select name="input_format"><?php
                        foreach (['csv', 'ssv', 'tsv', 'json', 'yaml'] as $f) {
                            echo '<option value="' . $f . '" ' . ($inputFormat === $f ? 'selected' : '') . '>' . strtoupper($f) . '</option>';
                        }
                    ?></select>
                    <textarea name="input_data" placeholder="Wprowadź dane..."><?php echo $inputData; ?></textarea>
                </div>

                <div class="flex-child">
                    <select name="output_format"><?php
                        foreach (['csv', 'ssv', 'tsv', 'json', 'yaml'] as $f) {
                            echo '<option value="' . $f . '" ' . ($outputFormat === $f ? 'selected' : '') . '>' . strtoupper($f) . '</option>';
                        }
                        ?></select>
                    <pre><?php echo $outputData; ?></pre>
                </div>
            </div>
            <button type="submit">Convert</button>
        </form>
    </div>
</body>
</html>