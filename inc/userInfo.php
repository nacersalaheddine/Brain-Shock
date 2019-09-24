<?php
class UserInfo{

    private $ip;
    private $browser;
    private $referrer;

    function __construct(){
        $this->ip = $_SERVER['REMOTE_ADDR'];
        $this->browser = $_SERVER['HTTP_USER_AGENT'];
        $this->referrer = $_SERVER['HTTP_REFERER'];
    }
    
    public function get_ip(){
        return  $this->ip;
    }
    function get_user_browser(){
        return $this->browser;
        //return get_browser();
    }
    function get_referrer(){
        if ($this->referrer == "") {
            $this->referrer = "This page was accessed directly";
            
        }
        return $this->referrer;
    }


}


$user = new UserInfo();
?>