<html lang="en">

    <head>

        @include('partials._commonStyles')
        @include('partials._commonScripts')
        <!-- Owl Carousel CSS -->
        <link rel="shortcut icon" href="icons/logo.jpg" /> 
        <link rel="stylesheet" href="asset/css/owl.carousel.css" type="text/css">
        <link rel="stylesheet" href="asset/css/owl.theme.css" type="text/css">
        <link rel="stylesheet" href="asset/css/owl.transitions.css" type="text/css">
          <!-- Font Awesome CSS -->
        <link rel="stylesheet" href="asset/font-awesome/css/font-awesome.min.css" type="text/css">

        <!-- Css3 Transitions Styles  -->
        <link rel="stylesheet" type="text/css" href="asset/css/animate.css">
        
        <!-- Lightbox CSS -->
        <link rel="stylesheet" type="text/css" href="asset/css/lightbox.css">

        <!-- Sulfur CSS Styles  -->
        <link rel="stylesheet" type="text/css" href="asset/css/style.css">

        <!-- Responsive CSS Style -->
        <link rel="stylesheet" type="text/css" href="asset/css/responsive.css">


        <script src="asset/js/modernizrr.js"></script>
    
    </head>

    <body ng-app='mbiscApp'>   
       <div ui-view></div>     
    </body>

        <script src='js/core.js'></script>
        <script src='js/homeController.js'></script>
        <script src='js/admin.js'></script>
        <script src='js/candidate.js'></script>
</html>