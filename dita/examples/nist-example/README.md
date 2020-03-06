# Examples With External Resources, Relative URIs, Tailoring Component

These examples, adapted from the 
[NIST SCAP 1.3 page](https://csrc.nist.gov/Projects/Security-Content-Automation-Protocol/SCAP-Releases/SCAP-1-3 "NIST SCAP 1.3 page") 
source data stream example,
demonstrate use of the `@localUri` attribute to handle relative 
URI references from the XCCDF and CPE dictionary files to their 
respective OVAL files and use of `@scope` for external (Internet) 
resources.

These DITA maps may be used as SCAP Composer input:

- `nist-example-external.ditamap` - component resources are all external
- `nist-example-local.ditamap` - component resources are all on the local file system
- `nist-example-hybrid.ditamap` - some component resources are local and some are external
- `nist-example-hybrid-tailoring.ditamap` - same as above, but with a local tailoring component resource
