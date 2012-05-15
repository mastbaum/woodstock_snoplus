woodstock for SNO+
==================

SNO+-specific woodstock front-end for looking at [snoop](http://github.com/mastbaum/snoop) data.

Installation
------------

1. Install woodstock: `$ pip install -e git+git://github.com/mastbaum/woodstock.git#egg=woodstock`
2. Install woodstock\_snoplus: `$ pip install -e git+git://github.com/mastbaum/woodstock_snoplus.git#egg=woodstock_snoplus`

Getting Started
---------------
To run woodstock:

    $ woodstock [/path/to/config.py]

This will start a Python WSGI server on the port specified in `config.py` (defaults to 8051). You may wish to proxy that through another web server.

### Configuration ###

Configuration is read from a Python module, which may specify a `port` (int) and some `rewrites` (dict). The rewrites look like this:

    rewrites = {
        r'^\/?$': View('./templates/index.md', md_parser, base_html=base_html, title='snoop'),
        r'^foo\/?$': View('./templates/foo.md', md_parser, base_html=base_html),
    }

Requests are handled by a `View` instance depending on their path.

### Static Files ###

There are two ways to serve static files: through woodstock or through a web server like Apache. The latter is strongly recommended for production environments, as the former may not be secure. To use the built-in file server for testing, however, add something like the following to your rewrites:

    r'^assets(.+)?$': woodstock.file_server.FileServer(static_root)

In this case, the physical directory given by `static_root` contains a directory called "assets," the contents of which are served.

Writing Templates
-----------------
Templates are written in [Markdown](http://daringfireball.net/projects/markdown/) with some extra tags for filling in dynamic content. The data coming out of snoop is mapped to a REST API, so you can display or plot the data using these tags and a URI.

This dynamic content can be mixed in with normal Markdown to compose a page.

### REST API ###
A simple URL-based API provides access to the data written out by snoop processors. From the server root,

    /foo/bar - Get the most recent value of the 'bar' parameter from the 'foo' processor
    /foo/bar/all - Get a list of (timestamp, value) tuples for all samples of foo.bar
    /foo/bar/year - Get a list of (timestamp, value) tuples for all samples of foo.bar in the past year
    /foo/bar/month - Get a list of (timestamp, value) tuples for all samples of foo.bar in the past month
    /foo/bar/week - Get a list of (timestamp, value) tuples for all samples of foo.bar in the past week
    /foo/bar/day - Get a list of (timestamp, value) tuples for all samples of foo.bar in the past day
    /foo/bar/hour - Get a list of (timestamp, value) tuples for all samples of foo.bar in the past hour
    /foo/bar/123..456 -  Get a list of (timestamp, value) tuples for all samples of foo.bar within the specified timestamp range

Any of the above may also specify a sequence of cuts via the query string:

    /foo/bar/all?baz.quux=42 - Like /foo/bar/all, but only for times when baz.quux was 42

### Values ###
To show a value (a number, string, list, nested dictionary, etc.) directly out of the database:

    {value URL}

To make a (time series) plot:

    {plot URL}

To make a sparkline:

    {sparkline URL}

To make a "sparkrow" (sparkline + current value + min and max):

    {sparkrow URL}

