<!-- ====================================================
     SCAP Enumeration Domain Module
    
     Author: Joshua Lubell

     ==================================================== -->

<!-- ============================================================= -->
<!--                   ELEMENT NAME ENTITIES                       -->
<!-- ============================================================= -->

<!ENTITY % cveID    "cveID"  >
<!ENTITY % cpeID    "cpeID"  >
<!ENTITY % cceID    "cceID"  >

<!-- ============================================================= -->
<!--                    ELEMENT DECLARATIONS                       -->
<!-- ============================================================= -->

<!--                    LONG NAME: CVE Element                     -->
<!ENTITY % cveID.content 
  " 
  (#PCDATA)*
  "
>
<!ENTITY % cveID.attributes
  '
  %univ-atts;          
  keyref
    CDATA
    #IMPLIED
  outputclass 
    CDATA
    #IMPLIED    
  '
>
<!ELEMENT cveID %cveID.content; >
<!ATTLIST cveID %cveID.attributes; >

<!--                    LONG NAME: CPE Element                     -->
<!ENTITY % cpeID.content 
  " 
  (#PCDATA)*
  "
>
<!ENTITY % cpeID.attributes
  '
  %univ-atts;          
  keyref
    CDATA
    #IMPLIED
  outputclass 
    CDATA
    #IMPLIED    
  '
>
<!ELEMENT cpeID %cpeID.content; >
<!ATTLIST cpeID %cpeID.attributes; >

<!--                    LONG NAME: CCE Element                     -->
<!ENTITY % cceID.content 
  " 
  (#PCDATA)*
  "
>
<!ENTITY % cceID.attributes
  '
  %univ-atts;          
  keyref
    CDATA
    #IMPLIED
  outputclass 
    CDATA
    #IMPLIED    
  '
>
<!ELEMENT cceID %cceID.content; >
<!ATTLIST cceID %cceID.attributes; >

<!-- ============================================================= -->
<!--                    SPECIALIZATION ATTRIBUTE DECLARATIONS      -->
<!-- ============================================================= -->


<!ATTLIST cveID %global-atts;  class CDATA "+ topic/keyword scapEnum-d/cveID "  >
<!ATTLIST cpeID %global-atts;  class CDATA "+ topic/keyword scapEnum-d/cpeID "  >
<!ATTLIST cceID %global-atts;  class CDATA "+ topic/keyword scapEnum-d/cceID "  >

<!-- =============== End SCAP Enumeration Domain ================= -->