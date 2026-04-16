/****** Object:  StoredProcedure [dbo].[api_MPNextTools_UpdatePageFieldOrder]    Script Date: 04/16/2026 ******/
DROP PROCEDURE IF EXISTS [dbo].[api_MPNextTools_UpdatePageFieldOrder]
GO

/****** Object:  StoredProcedure [dbo].[api_MPNextTools_UpdatePageFieldOrder]    Script Date: 04/16/2026 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- api_MPNextTools_UpdatePageFieldOrder
-- =============================================
-- Description: Upserts a page field row by Page_ID + Field_Name.
--              Updates if exists, inserts if not.
-- Last Modified: 04/16/2026
-- Chris Kehayias
-- =============================================
CREATE PROCEDURE [dbo].[api_MPNextTools_UpdatePageFieldOrder]
    @DomainID INT,
    @PageID INT,
    @FieldName VARCHAR(64),
    @GroupName NVARCHAR(75) = NULL,
    @ViewOrder SMALLINT = NULL,
    @Required BIT = 0,
    @Hidden BIT = 0,
    @DefaultValue NVARCHAR(128) = NULL,
    @FilterClause NVARCHAR(2000) = NULL,
    @DependsOnField VARCHAR(64) = NULL,
    @FieldLabel NVARCHAR(64) = NULL,
    @WritingAssistantEnabled BIT = 0
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1 FROM dp_Page_Fields
        WHERE Page_ID = @PageID AND Field_Name = @FieldName
    )
    BEGIN
        UPDATE dp_Page_Fields
        SET Group_Name = @GroupName,
            View_Order = @ViewOrder,
            Required = @Required,
            Hidden = @Hidden,
            Default_Value = @DefaultValue,
            Filter_Clause = @FilterClause,
            Depends_On_Field = @DependsOnField,
            Field_Label = @FieldLabel,
            Writing_Assistant_Enabled = @WritingAssistantEnabled
        WHERE Page_ID = @PageID AND Field_Name = @FieldName;
    END
    ELSE
    BEGIN
        INSERT INTO dp_Page_Fields (
            Page_ID, Field_Name, Group_Name, View_Order,
            Required, Hidden, Default_Value, Filter_Clause,
            Depends_On_Field, Field_Label, Writing_Assistant_Enabled
        )
        VALUES (
            @PageID, @FieldName, @GroupName, @ViewOrder,
            @Required, @Hidden, @DefaultValue, @FilterClause,
            @DependsOnField, @FieldLabel, @WritingAssistantEnabled
        );
    END

END
GO

-- =============================================
-- SP MetaData Install
-- =============================================
DECLARE @spName NVARCHAR(128) = 'api_MPNextTools_UpdatePageFieldOrder';
DECLARE @spDescription NVARCHAR(500) = 'Upserts a page field row by Page_ID + Field_Name';

IF NOT EXISTS (
    SELECT API_Procedure_ID FROM dp_API_Procedures WHERE Procedure_Name = @spName
)
BEGIN
    INSERT INTO dp_API_Procedures (Procedure_Name, Description)
    VALUES (@spName, @spDescription);
END

-- Grant to Administrators Role
DECLARE @AdminRoleID INT = (
    SELECT Role_ID FROM dp_Roles WHERE Role_Name = 'Administrators'
);

IF NOT EXISTS (
    SELECT 1
    FROM dp_Role_API_Procedures RP
    INNER JOIN dp_API_Procedures AP ON AP.API_Procedure_ID = RP.API_Procedure_ID
    WHERE AP.Procedure_Name = @spName AND RP.Role_ID = @AdminRoleID
)
BEGIN
    INSERT INTO dp_Role_API_Procedures (Domain_ID, API_Procedure_ID, Role_ID)
    VALUES (
        1,
        (SELECT API_Procedure_ID FROM dp_API_Procedures WHERE Procedure_Name = @spName),
        @AdminRoleID
    );
END
GO
