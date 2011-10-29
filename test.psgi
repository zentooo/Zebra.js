use strict;
use warnings;

use Amon2::Lite;
use Plack::Builder;


get '/*' => sub {
    my ($c, $p) = @_;

    use Data::Dump qw/dump/;

    $c->render("index.tt", +{
        path => $p->{splat}->[0],
    });
};

builder {
    enable "Plack::Middleware::Static", path => qr/.js$|.css$/, root => "./";
    __PACKAGE__->to_app();
};


__DATA__

@@ index.tt
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8" />
	<title>QUnit Test Suite</title>
	<link rel="stylesheet" href="/static/qunit.css" type="text/css" media="screen">
	<script type="text/javascript" src="/static/qunit.js"></script>

	<script type="text/javascript" src="/src/zebra.js"></script>
	<script type="text/javascript" src="/src/zebra/list.js"></script>

	<script type="text/javascript" src="/test/helper.js"></script>
	<script type="text/javascript" src="/test/lib/sinon-1.1.1.js"></script>

	<script type="text/javascript" src="/src/[% path %].js"></script>
	<script type="text/javascript" src="/test/[% path %].js"></script>
</head>
<body>
	<h1 id="qunit-header">QUnit Test Suite</h1>
	<h2 id="qunit-banner"></h2>
	<div id="qunit-testrunner-toolbar"></div>
	<h2 id="qunit-userAgent"></h2>
	<ol id="qunit-tests"></ol>
	<div id="qunit-fixture">test markup</div>
</body>
</html>
