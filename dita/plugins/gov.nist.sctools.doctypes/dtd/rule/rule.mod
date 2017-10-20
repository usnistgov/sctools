<?xml version="1.0" encoding="UTF-8"?>

<!-- ============================================================= -->
<!--                   ARCHITECTURE ENTITIES                       -->
<!-- ============================================================= -->

<!-- default namespace prefix for DITAArchVersion attribute can be
     overridden through predefinition in the document type shell   -->
<!ENTITY % DITAArchNSPrefix
  "ditaarch"
>

<!-- must be instanced on each topic type                          -->
<!ENTITY % arch-atts 
             "xmlns:%DITAArchNSPrefix; 
                        CDATA
                                  #FIXED 'http://dita.oasis-open.org/architecture/2005/'
              %DITAArchNSPrefix;:DITAArchVersion
                        CDATA
                                  '1.2'
"
>


<!-- ============================================================= -->
<!--                   SPECIALIZATION OF DECLARED ELEMENTS         -->
<!-- ============================================================= -->


<!ENTITY % rule-info-types 
  "no-topic-nesting"
>


<!-- ============================================================= -->
<!--                   ELEMENT NAME ENTITIES                       -->
<!-- ============================================================= -->
 

<!ENTITY % rule     "rule"                                     >
<!--<!ENTITY % title "title" >-->
<!ENTITY % rulebody     "rulebody"                                     >
<!ENTITY % description "description" >
<!ENTITY % rationale "rationale" >
<!ENTITY % check "check" >
<!ENTITY % AND "AND" >
<!ENTITY % OR "OR" >
<!ENTITY % oval "oval" >


<!-- ============================================================= -->
<!--                    DOMAINS ATTRIBUTE OVERRIDE                 -->
<!-- ============================================================= -->


<!ENTITY included-domains 
  ""
>


<!-- ============================================================= -->
<!--                    ELEMENT DECLARATIONS                       -->
<!-- ============================================================= -->


<!--                    LONG NAME: Rule                         -->
<!ENTITY % rule.content
                       "(%title;, 
                         %rulebody;, 
                         (%rule-info-types;)* )"
>
<!ENTITY % rule.attributes
             "id 
                        ID 
                                  #REQUIRED
              %conref-atts;
              %select-atts;
              %localization-atts;
              outputclass 
                        CDATA 
                                  #IMPLIED"
>

<!ELEMENT rule    %rule.content;>
<!ATTLIST rule    
              %rule.attributes;
              %arch-atts;
              domains 
                        CDATA 
                                  "&included-domains;">

<!--                    LONG NAME: Rule Body                    -->
<!ENTITY % rulebody.content
                       "(
                         %description;, 
                          %rationale;, 
                          %check; )"
>
<!ENTITY % rulebody.attributes
             "%id-atts; 
              %localization-atts; 
              base 
                        CDATA 
                                  #IMPLIED 
              %base-attribute-extensions; 
              outputclass 
                        CDATA 
                                  #IMPLIED" 
>

<!ELEMENT rulebody %rulebody.content; >
<!ATTLIST rulebody    %rulebody.attributes;>

<!--                    LONG NAME: Description                           -->
<!ELEMENT description %section.content; >
<!ATTLIST description %section.attributes; >

<!--                    LONG NAME: Rationale                           -->
<!ELEMENT rationale %section.content; >
<!ATTLIST rationale %section.attributes; >
 
<!--                    LONG NAME: Check                           -->
<!ENTITY % ANDOR.content
"( %OR; | %AND; | %oval; )+">

<!ENTITY % check.content
"( %OR; | %AND; | %oval; )">
<!ELEMENT check %check.content; >
<!ATTLIST check %section.attributes; >

<!--                    LONG NAME: AND                           -->
<!ELEMENT AND %ANDOR.content; >
<!ATTLIST AND %sectiondiv.attributes; >

<!--                    LONG NAME: OR                           -->
<!ELEMENT OR %ANDOR.content; >
<!ATTLIST OR %sectiondiv.attributes; >

<!--                    LONG NAME: Oval                           -->
<!ELEMENT oval %xref.content; >
<!ATTLIST oval %xref.attributes; >

<!-- ============================================================= -->
<!--                    SPECIALIZATION ATTRIBUTE DECLARATIONS      -->
<!-- ============================================================= -->

<!ATTLIST rule     %global-atts;  class CDATA "- topic/topic concept/concept rule/rule ">
<!ATTLIST rulebody     %global-atts;  class CDATA "- topic/body  concept/conbody rule/rulebody ">
<!ATTLIST description %global-atts; class CDATA "- topic/section concept/section rule/description " >
<!ATTLIST rationale %global-atts; class CDATA "- topic/section concept/section rule/rationale " >
<!ATTLIST check %global-atts; class CDATA "- topic/section concept/section rule/check " >
<!ATTLIST OR %global-atts; class CDATA "- topic/sectiondiv concept/sectiondiv rule/OR " >
<!ATTLIST AND %global-atts; class CDATA "- topic/sectiondiv concept/sectiondiv rule/AND " >
<!ATTLIST oval %global-atts; class CDATA "- topic/xref concept/xref rule/oval " >

<!-- ================== End DITA Concept  ======================== -->




