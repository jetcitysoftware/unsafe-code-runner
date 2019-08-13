<?
   function app($ctx=[]) {
      $context = json_decode($ctx);
      $result['body'] = "Hello from php";
      return json_encode($result);
   }
?>
