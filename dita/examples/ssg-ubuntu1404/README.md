# Ubuntu 14.04 AppArmor Example

This example, based on Ubuntu Linux 14.04 content from the 
[ComplianceAsCode GitHub project](https://github.com/ComplianceAsCode/content), illustrates the 
use of SCAP Composer to supplement an existing SCAP source data 
stream collection
with additional SCAP content needed for a niche purpose. 

The `original` directory contains the original SCAP 1.2 and 
SCAP 1.3 source data stream collections from ComplianceAsCode.

The `ssg-ubuntu1404-\*.xml` files are XML resources obtained 
by extracting
content from the SCAP 1.3 source data stream collection's 
`\<component\>` elements. 

The `apparmor-\*.xml` XML resource files supplement the ComplianceAsCode 
content with added XCCDF and OVAL content applicable to 
the Ubuntu AppArmor kernel module.

`ssg-ubuntu1404.ditamap` is an SCAP Composer DITA map defining a source data
a source data stream collection containing both the 
ComplianceAsCode Ubuntu 14.04 and the additional 
AppArmor-specific XML resources. Use this file as input to SCAP
Composer.

The `scap1_2` directory contains an SCAP Composer DITA map 
with XML resources extracted from the ComplianceAsCode SCAP 1.2
source data stream collection file.
