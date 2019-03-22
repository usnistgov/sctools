# Example With External Resources and Relative URIs

This example uses the `@localUri` attribute to handle relative 
URI references from the XCCDF and CPE dictionary files to their 
respective OVAL files. Each 
`<scapComponent>` resource is referenced externally, so `@scope` 
is set to `external`.

Adapted from the [NIST SCAP 1.3 page](https://csrc.nist.gov/Projects/Security-Content-Automation-Protocol/SCAP-Releases/SCAP-1-3 "NIST SCAP 1.3 page") source data stream example.