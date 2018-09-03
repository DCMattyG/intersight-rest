import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="intersight_rest",
    version="1.0.0",
    author="Matthew Garrett",
    author_email="mgarrett0402@gmail.com",
    description="Cisco Intersight NodeJS REST Module",
    long_description="Cisco has released their new Intersight platform for managing UCS Server and Hyperflex Hyperconverged infrastructure from a SaaS based interface. With high security standards, forming and signing the RESTful API calls to Intersight can be a challenge, so this package was written to do all of that work for you.",
    long_description_content_type="text/markdown",
    url="https://github.com/dcmattyg/intersight-rest",
    packages=setuptools.find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: Cisco Sample Code License, Version 1.0",
        "Operating System :: OS Independent",
    ],
)
