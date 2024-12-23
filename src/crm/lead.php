<?php

$token = 'DNBC-3VgDWLIIrpyBab0l9bISr0C-0VO';
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

logRequest($input);
echo send($token, ['Lead' => $input], $input);

function send($token, $data, $input)
{
    $url = '';

    if (empty($url)) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'No connector URL provided']);
        exit;
    }

    $ch = curl_init();
    $curl_options = [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HEADER => 1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_HTTPHEADER => [
            "Authorization: Bearer $token",
            'Content-Type: application/json'
        ],
    ];

    curl_setopt_array($ch, $curl_options);
    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        $error_msg = curl_error($ch);
        logResponse("CURL error: $error_msg", [], $input);
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'CURL error', 'details' => $error_msg]);
        curl_close($ch);
        exit;
    }

    $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $header = substr($response, 0, $header_size);
    $body = substr($response, $header_size);
    $bodyArray = json_decode($body, true);

    $log = [
        'input' => $data,
        'response' => $bodyArray,
    ];

    if (!empty($bodyArray['Deal_ID'])) {
        $msg = 'Success send status at {date}';
        logResponse($msg, $log, $input);
        http_response_code(200);
        echo json_encode($bodyArray);
    } else {
        $msg = 'Error in progress at {date}';
        logResponse($msg, $log, $input);
        http_response_code(422);
        echo json_encode([
            'status' => 'error',
            'message' => 'Deal_ID is missing in the response ZOHO',
            'code' => 422,
        ]);
    }
}

function logResponse($msg, $response, $input)
{
    $date = date("Y-m-d H:i:s");
    $string = [
        'message' => str_replace('{date}', $date, $msg),
        'data' => $response,
    ];
    writeLog(date("Y-m-d") . "-Resp.txt", $string);
}

function logRequest($request)
{
    $date = date("Y-m-d H:i:s");
    $string = [
        'date' => $date,
        'input' => $request,
    ];
    writeLog(date("Y-m-d") . "-Req.txt", $string);
}

function writeLog($filename, $data)
{
    $logDir = "lead-log";
    if (!is_dir($logDir) && !mkdir($logDir, 0777, true) && !is_dir($logDir)) {
        throw new RuntimeException("Failed to create log directory: $logDir");
    }
    file_put_contents("$logDir/$filename", json_encode($data, JSON_PRETTY_PRINT) . PHP_EOL, FILE_APPEND);
}

  // UA
  // https://goit-connectors.place/goit/

  // UA Survey
  // https://goit-connectors.place/goit/survey/App.php

  // PL
  // https://goit-connectors.place/pl/newcrm/goit/connectorPL.php

  // PL Survey
  // https://goit-connectors.place/pl/newcrm/surveyG/App.php

  // PH
  // https://goit-connectors.place/phillipines/zoho/loader.php

  // PH Survey
  // https://goit-connectors.place/phillipines/survey/App.php

  // RO
  // https://goit-connectors.place/romania/goit/connector.php

  // RO Survey
  // https://goit-connectors.place/romania/survey/App.php

  // ES
  // https://goit-connectors.place/latam/connector/connector.php

  // GOITEENS UA
  // https://universalcrmconnector.goiteens.ua/connector.php

  // GOITEENS ES
  // https://es.goiteens.com/crm/connector.php

  // GOITEENS TR
  // https://tr.goiteens.com/crm/connector.php
