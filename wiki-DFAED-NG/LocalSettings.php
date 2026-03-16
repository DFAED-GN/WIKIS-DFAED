<?php
# LocalSettings.php — MediaWiki 1.31 / Semantic MediaWiki

# Protect against web entry
if ( !defined( 'MEDIAWIKI' ) ) {
	exit;
}

$wgSitename = "Documentation FAED v3";
$wgMetaNamespace = "Documentation_FAED_v3";

$wgScriptPath = "";

## The protocol and server name to use in fully-qualified URLs
$wgServer = "http://localhost:8080";

## The relative URL path to the skins directory
$wgStylePath = "$wgScriptPath/skins";

$wgLogo = "$wgScriptPath/resources/assets/wiki.png";

$wgEnableEmail = true;
$wgEnableUserEmail = true; # UPO

$wgEmergencyContact = "apache@localhost";
$wgPasswordSender = "apache@localhost";

$wgEnotifUserTalk = false; # UPO
$wgEnotifWatchlist = false; # UPO
$wgEmailAuthentication = true;

## Database settings
$wgDBtype = "mysql";
$wgDBserver = "database";
$wgDBname = "my_wiki";
$wgDBuser = "wikiuser";
$wgDBpassword = "wikipass";

$wgDBprefix = "";
$wgDBTableOptions = "ENGINE=InnoDB, DEFAULT CHARSET=binary";
$wgDBmysql5 = false;

## Shared memory settings
$wgMainCacheType = CACHE_NONE;
$wgMemCachedServers = [];

## Uploads
$wgEnableUploads = true;
$wgGroupPermissions['sysop']['import'] = true;
$wgGroupPermissions['sysop']['importupload'] = true;
$wgUseImageMagick = true;
$wgImageMagickConvertCommand = "/usr/bin/convert";

$wgUseInstantCommons = false;
$wgPingback = false;

$wgLanguageCode = "fr";

$wgSecretKey = "5343e6a889da74f163aae6a41c4c75da5e99d18fb7844eff55791862dcc4bcab";

$wgAuthenticationTokenVersion = "1";

$wgUpgradeKey = "6064a4f04842e5f5";

$wgDefaultSkin = "monobook";

$wgRightsPage = "";
$wgRightsUrl = "";
$wgRightsText = "";
$wgRightsIcon = "";

$wgDiff3 = "/usr/bin/diff3";

# ---------------------------------------------------------
# SKINS
# ---------------------------------------------------------

wfLoadSkin( 'MonoBook' );
wfLoadSkin( 'Vector' );

# ---------------------------------------------------------
# EXTENSIONS
# ---------------------------------------------------------

wfLoadExtension( 'WikiEditor' );

$wgDefaultUserOptions['usebetatoolbar'] = 1;
$wgDefaultUserOptions['wikieditor-preview'] = 1;

# Semantic MediaWiki (installé via Composer — enableSemantics() charge tout)
enableSemantics( 'localhost' );

# ---------------------------------------------------------
# LOADING LOCAL STAGING ASSETS
# ---------------------------------------------------------

$wgHooks['BeforePageDisplay'][] = function ( OutputPage $out, Skin $skin ) {
	# Emulates MediaWiki:Common.js (defer ensures jQuery/mw are ready first)
	$out->addScript( '<script src="/staging_area/Common.js" defer></script>' );

	# Emulates MediaWiki:Common.css
	$out->addHeadItem( 'staging-css', '<link rel="stylesheet" href="/staging_area/Common.css">' );

	# PRELOAD DSFR CSS (Fixes FOUC in Local)
	$out->addHeadItem( 'dsfr-css', '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.12.1/dist/dsfr.min.css">' );
	$out->addHeadItem( 'dsfr-utility-css', '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.12.1/dist/utility/utility.min.css">' );
	$out->addHeadItem( 'dsfr-icons-css', '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.12.1/dist/utility/icons/icons.min.css">' );

	# Local Overrides
	$out->addHeadItem( 'dsfr-overrides', '<link rel="stylesheet" href="/staging_area/dsfr/Style.css">' );

	return true;
};
