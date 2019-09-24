<?php
class Session{
    private $connected = false;
    public $user_ip;//ip

    function __construct(){
      session_start();
      $this->check_connected();
    }

    private function check_connected(){
      if(isset($_SESSION["user_id"])){
        $this->connected = true;
        $this->user_ip = $_SESSION["user_ip"];

      }else{
        unset($this->user_ip);
        $this->connected = false;
      }

    }

    public function is_connected(){
      return $this->connected;
    }
    public function connect($user){
      //check database here
      if($user){
       $this->user_ip =  $_SESSION["user_ip"] = $user->ip;
       $this->connected = true;
      }
    }
    public function disconnect(){
      unset($_SESSION["user_ip"]);
      unset($this->user_ip);
      $this->connected = false;
    }

  }

  $session = new Session();
?>
