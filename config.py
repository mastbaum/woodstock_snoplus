from woodstock.file_server import FileServer
from woodstock.md import DynamicMarkdown
from woodstock.view import View

# server port
port = 8051

# paths
template_root = './templates/'
static_root = './static'

# set up dynamic markdown parser
rest_server = 'http://localhost:8052'
md_parser = DynamicMarkdown(rest_server)

# load up base template
template_base = template_root + 'base.html'
with open(template_base) as f:
    base_html = f.read()

rewrites = {
    r'^\/?$': View(template_root + 'index.md', md_parser, base_html=base_html, title='snoop'),
    r'^trigger\/?$': View(template_root + 'trigger.md', md_parser, base_html=base_html),
    r'^assets(.+)?$': FileServer(static_root)
}

